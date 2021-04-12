// tslint:disable: variable-name
import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';

// app/common
import { isIdentity, ReadonlyMatrix } from 'src/app/common/matrix-math';

import { ControlDragEvent } from '../svg-view/svg-view.component';
import { SampleDialogComponent } from '../sample-dialog/sample-dialog.component';
import { SvgOpenDialogComponent } from '../svg-open-dialog/svg-open-dialog.component';
import { TransformChangeEvent } from '../menu-transform/menu-transform.component';

import { BackgroundImageService } from '../services/background-image.service';
import { DECIMAL_FORMAT_LABELS, EditorSettingsService } from '../services/editor-settings.service';
import { PathDataService } from '../services/path-data.service';

import * as Path from '../svg-path/svg-path-item';

const SAMPLE_PATH_DATA =
'm205 698c-17-194 169-280 169-408s-24-259 127-274s177 84 174 243s218 217 164 452c43 15 31 74 55 97'
+ 's50 71-18 97s-75 47-107 77s-129 64-154-28c-45 7-47-8-95-7s-59 10-108 13c-35 78-151 26-174 13'
+ 's-94-9-124-25s-23-52-12-83s-26-87 30-107s40-29 73-60zm-9 30c-20 39-66 34-76 51s-12 23-4 64'
+ 's-18 40-7 78s104 16 156 50s139 24 141-36s-70-102-90-157s-74-120-120-50zm103-60'
+ 'c-56-80 35-193 26-195s-63 84-59 160s86 96 111 126s59 83-4 85q20 22 31 40a150 100-8 00 217-10'
+ 'c33-30 4-182 71-192c-4-74 116-10 116 7s4 21 10 16s12-38-59-66c20-83-54-183-71-182s85 65 51 175'
+ 'q-9-4-22-3c-21-119-82-163-117-316q-12 18-37 30t-30 15q-55 33-90 4t-40-28c-5 121-100 220-104 334'
+ 'zm390 28c-44 17-26 115-47 172s-23 102 16 124s80 6 119-34s68-55 102-69q57-20 4-74'
+ 'c-30-41-15-64-32-82s-28-14-50-12q-88 76-112-25zm9-3c12 73 93 20 85-3s-89-65-85 3m-100-403'
+ 'c-5-29-46-27-77-47s-66-11-84 6s-48 34-48 50s16 25 43 45s41 39 90 11s79-30 76-65zm-14-29'
+ 'a51 65 2 10-86-34l24 9a23 36 0 11 37 17zm-120-34a38 56-1 10-55 38l15-11a16 28-4 11 18-17z'
+ 'm-61 65c81 80 122 15 173-2v5c-52 27-103 80-174 3z';

const SAMPLE_STEP = 25;

const SAMPLE_PATH_ITEMS: { [key in Path.DrawCommand] : number[] } = {
  M: [SAMPLE_STEP, SAMPLE_STEP],
  L: [SAMPLE_STEP, SAMPLE_STEP],
  H: [SAMPLE_STEP],
  V: [SAMPLE_STEP],
  Z: [],
  C: [SAMPLE_STEP, 0, 0, SAMPLE_STEP, SAMPLE_STEP, SAMPLE_STEP],
  S: [0, SAMPLE_STEP, SAMPLE_STEP, SAMPLE_STEP],
  Q: [SAMPLE_STEP, 0, SAMPLE_STEP, SAMPLE_STEP],
  T: [SAMPLE_STEP, SAMPLE_STEP],
  A: [SAMPLE_STEP, SAMPLE_STEP, 0, 0, 0, SAMPLE_STEP, SAMPLE_STEP],
};

const enum EditMode { All, Group, Single }

const DARK_THEME = 'app-dark-theme';

function compact(pathData: string): string {
  // remove spaces:
  return pathData
    .replace(/\s*([MLHVZCSQTA])\s*/gmi, '$1')
    .replace(/\s+(\-)/gmi, '$1');
}

@Component({
  selector: 'app-svg-path-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  // pathTabs = ['Raw Data', 'Command Selector', 'Path Walker'];
  editMode: EditMode = EditMode.All;
  singleSelectionIndex = 0;
  groupSelectionIndices: ReadonlyArray<number> = [];

  path: Path.PathArray = [];
  pathInput = '';

  readonly decimalFormats = DECIMAL_FORMAT_LABELS;
  // decimals = ['to integer', '1 decimal place', '2 decimal places', '3 decimal places', '4 decimal places', '5 decimal places'];

  previewMatrix?: ReadonlyMatrix;

  readonly commandNames = Path.COMMAND_FULL_NAMES;
  readonly commands = Object.keys(Path.COMMAND_FULL_NAMES);

  get activeItem() {
    return this.path[this.firstSelectionIndex];
  }

  get selectMode(){
    const count = Path.countSelected(this.path);
    return count === 1 ? 'Single Item' : count > 0 ? 'Selection' : 'All';
  }

  get isAllSelected() {
    return Path.isAllSelected(this.path);
  }

  get isSomeSelected() {
    return Path.isSomeSelected(this.path);
  }

  get groups() {
    return Path.getGroups(this.path);
  }

  get firstSelectionIndex() {
    return Path.getFirstSelectionIndex(this.path);
  }

  get hasArc() {
    const all = !Path.hasSelection(this.path);
    return !!this.path.find(item => (all || item.selected) && Path.isEllipticalArc(item));
  }

  get canPromoteToCurve() {
    const all = !Path.hasSelection(this.path);
    return !!this.path.find(item => (all || item.selected) && Path.canPromoteToCurve(item));
  }

  get canPromoteToQCurve() {
    const all = !Path.hasSelection(this.path);
    return !!this.path.find(item => (all || item.selected) && Path.canPromoteToQCurve(item));
  }

  get selectionBoundingRect() {
    const path = this.path;
    return path.length > 0 ? Path.getBoundingRect(path, Path.hasSelection(path)) : undefined;
  }

  constructor(
    public settings: EditorSettingsService,
    public history: PathDataService,
    public background: BackgroundImageService,
    private _dialog: MatDialog,
    private _overlayContainer: OverlayContainer) { }

  onDrag(event: ControlDragEvent) {
    if (event.name === 'DragMove') {
      switch (event.point.type) {
        case 'curve1':
          Path.curve1At(this.path, event.point.itemIndex, event.deltaX, event.deltaY);
          break;
        case 'curve2':
          Path.curve2At(this.path, event.point.itemIndex, event.deltaX, event.deltaY);
          break;
        case 'move':
          Path.moveAt(this.path, event.point.itemIndex, event.deltaX, event.deltaY);
          break;
      }
    } else if (event.name === 'DragStop') {
      if (event.startX !== event.point.x || event.startY !== event.point.y) {
        this.onPathModelChange('transform');
      }
    }
  }

  selectTab(mode: EditMode) {
    if (mode !== this.editMode) {
      if (this.editMode === EditMode.Group) {
        // Save group selection.
        this.groupSelectionIndices = Path.getSelectedIndices(this.path);
      } else if (this.editMode === EditMode.Single) {
        // Save single selection.
        this.singleSelectionIndex = this.firstSelectionIndex;
      }
      switch (mode) {
        case EditMode.All:
          // Clear any previously selected items.
          Path.selectAll(this.path, false);
          this.editMode = EditMode.All;
          break;
        case EditMode.Group:
          // Restore group selection.
          Path.selectGroup(this.path, this.groupSelectionIndices, true);
          this.editMode = EditMode.Group;
          break;
        case EditMode.Single:
          // Restore single selection.
          this.singleSelectionIndex = Math.min(Math.max(this.singleSelectionIndex, 0), this.path.length - 1);
          Path.selectDistinct(this.path, this.singleSelectionIndex, true);
          this.editMode = EditMode.Single;
          break;
      }
    }
  }

  onSingleSelectionChange(value: number) {
    if (this.singleSelectionIndex !== value) {
      this.singleSelectionIndex = value;
      Path.selectDistinct(this.path, value, true);
    }
  }

  onDelete() {
    if (Path.isSomeSelected(this.path)) {
      this.path = Path.deleteSelection(this.path);
      // Restore single selection.
      if (this.editMode === EditMode.Single) {
        this.singleSelectionIndex = Math.min(Math.max(this.singleSelectionIndex, 0), this.path.length - 1);
        Path.selectDistinct(this.path, this.singleSelectionIndex, true);
      }
      this.onPathModelChange();
    } else {
      this.onInputChange('M0 0');
    }
  }

  onSingleParameterChange() {
    this.onPathModelChange('transform');
  }

  // selectNext(event: KeyboardEvent) {
  //   if (this.selectedNode + 1 < this.pathModel.nodes.length) {
  //     event.preventDefault();
  //     this.selectedNode = this.selectedNode + 1;
  //   }
  // }

  // selectPrev(event: KeyboardEvent) {
  //   if (this.selectedNode > 0) {
  //     event.preventDefault();
  //     this.selectedNode = this.selectedNode - 1;
  //   }
  // }

  // onKeydown(event) {
  //   console.log('Key:', event);
  // }

  ngOnInit(): void {
    this.path = Path.createFromString(this.history.pathData || SAMPLE_PATH_DATA);
    this.onPathModelChange();

    this.settings.subscribe(state => {
      const src = this.settings.previousState?.darkMode;
      const dst = state.darkMode;
      if (src !== dst) {
        if (dst) {
          this._overlayContainer.getContainerElement().classList.add(DARK_THEME);
        } else {
          this._overlayContainer.getContainerElement().classList.remove(DARK_THEME);
        }
      }
    });
  }

  convertInput(relative: boolean) {
    Path.setOutputAsRelative(this.path, relative);
    this.formatInput();
  }

  compactInput() {
    const digits = this.settings.state.maximumFractionDigits;
    const data = this.path
      .map(item => ({ abs: compact(Path.asString(item, digits)), rel: compact(Path.asRelativeString(item, digits)) }));

    for (let i = this.path.length; i-- > 1;) {
      const item = this.path[i];
      const prev = this.path[i - 1];
      if (item.name === prev.name || (Path.isMoveTo(prev) && Path.isLineTo(item))) {
        data[i - 1].abs = compact(data[i - 1].abs + ' ' + data[i].abs.substring(1));
        data[i - 1].rel = compact(data[i - 1].rel + ' ' + data[i].rel.substring(1));
        data.splice(i, 1);
      }
    }

    const pathArray = data.map(item => (item.rel.length < item.abs.length ? item.rel : item.abs));
    this.pathInput = compact(pathArray.join(''));
    // this.pathInput = compact(this.pathInput);
  }

  formatInput() {
    this.pathInput = Path.asFormattedStringArray(this.path, this.settings.state.maximumFractionDigits).join('\n');
  }

  onFormatChange(value: number) {
    if (this.settings.set({ maximumFractionDigits: value })) {
      this.formatInput();
    }
  }

  onInputChange(pathInput: string) {
    if (pathInput !== this.pathInput) {
      this.pathInput = pathInput;
      this.path = Path.createFromString(pathInput);
      this.onPathModelChange('input');
    }
  }

  onUndo() {
    if (this.history.canUndo) {
      this.history.undo();
      this.onHistoryChange();
    }
  }

  onRedo() {
    if (this.history.canRedo) {
      this.history.redo();
      this.onHistoryChange();
    }
  }

  onHistoryChange() {
    const prevPath = this.path;
    const nextPath = Path.createFromString(this.history.pathData);

    // Temporary hack. Till the undo/redo concept is sorted out.
    if (Path.isAllSelected(prevPath)) {
      Path.selectAll(nextPath, true);
    } else if (Path.isSomeSelected(prevPath)) {
      for (let i = Math.min(prevPath.length, nextPath.length); i-- > 0;) {
        nextPath[i].outputAsRelative = prevPath[i].outputAsRelative;
        nextPath[i].selected = prevPath[i].selected;
      }
    }

    this.path = nextPath;
    this.onPathModelChange('history');
  }

  openSampleDialog() {
    const dialogRef = this._dialog.open(SampleDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (typeof result === 'string' && result.length > 0) {
        this.onInputChange(result);
      }
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  applyTransform(event: TransformChangeEvent) {
    if (event.preview) {
      this.previewMatrix = event.matrix;
    } else {
      this.previewMatrix = undefined;
      const matrix = event.matrix;
      if (matrix && !isIdentity(matrix)) {
        this.path = Path.createTransformed(this.path, matrix);
        this.onPathModelChange('transform');
      }
    }
  }

  onPathModelChange(changeType?: 'input' | 'history' | 'transform') {
    if (changeType !== 'input') {
      this.formatInput();
    }
    if (changeType !== 'history') {
      this.history.pathData = compact(this.path.map(item => Path.asString(item, -1)).join(''));
    }
  }

  loadSvg(event: Event) {
    const target = event.target as EventTarget & { files: FileList, value: any };
    if (target && target.files[0]) {
      const file: File = target.files[0];

      // There is no standard method to reset file input element. We'll just clear it.
      target.value = '';

      const dialogRef = this._dialog.open(SvgOpenDialogComponent, { data: file });
      dialogRef.afterClosed().subscribe(result => {
        if (typeof result === 'string' && result.length > 0) {
          this.onInputChange(result);
        }
      });
    }
  }

  onPathReverse() {
    this.path = Path.createReveresed(this.path);
    this.onPathModelChange();
  }

  onSelectAll(value: boolean) {
    Path.selectAll(this.path, value);
  }

  onAppend(command: Path.DrawCommand) {
    let lastIndex = Path.getLastSelectionIndex(this.path);
    if (lastIndex < 0) {
      lastIndex = this.path.length - 1;
    }
    const last = this.path[lastIndex];
    const next: Path.PathItem = Path.createPathNode(command, SAMPLE_PATH_ITEMS[command]);
    Path.translate(next, Path.getX(last), Path.getY(last));
    next.outputAsRelative = true;

    const nextIndex = lastIndex + 1;
    this.path = Path.appendAt(this.path, nextIndex, next);
    if (this.editMode === EditMode.Single || this.editMode === EditMode.Group) {
      Path.selectDistinct(this.path, this.singleSelectionIndex = nextIndex, true);
    }
    this.onPathModelChange();
  }

  onSplit() {
    const path = this.path;
    const index = Path.getFirstSelectionIndex(path);

    this.path =  index >= 0 ? Path.bisectSelection(path) : Path.bisectAll(path);
    if (this.editMode === EditMode.Single) {
      Path.selectDistinct(this.path, this.singleSelectionIndex = index, true);
    }
    this.onPathModelChange();
  }

  onEllipticalArcAppriximation() {
    const path = this.path;
    const index = Path.getFirstSelectionIndex(path);

    this.path = Path.approximateEllipticalArcs(path, index >= 0);
    if (this.editMode === EditMode.Single) {
      Path.selectDistinct(this.path, this.singleSelectionIndex = index, true);
    }
    this.onPathModelChange();
  }

  onPromoteToCurve() {
    this.path = Path.promoteToCurves(this.path, Path.hasSelection(this.path));
    this.onPathModelChange();
  }

  onPromoteToQCurve() {
    this.path = Path.promoteToQCurves(this.path, Path.hasSelection(this.path));
    this.onPathModelChange();
  }

  onClone(reversed?: boolean) {
    const path = this.path;

    // let firstIndex = Path.getFirstSelectionIndex(path);
    // if (firstIndex < 0) {
    //   firstIndex = 0;
    // }

    let lastIndex = Path.getLastSelectionIndex(path);
    if (lastIndex < 0) {
      lastIndex = path.length - 1;
    }

    let clone = Path.hasSelection(path) ? Path.cloneSelection(path) : Path.cloneAll(path);
    if (reversed) {
      clone = Path.createReveresed(clone);
    }
    // const deltaX = Path.getX(path[lastIndex]) - Path.getX(path[firstIndex]?.prev);
    // const deltaY = Path.getY(path[lastIndex]) - Path.getY(path[firstIndex]?.prev);
    // if (deltaX !== 0 || deltaY !== 0) {
    //   for (const node of clone) {
    //     Path.translate(node, deltaX, deltaY);
    //   }
    // }

    const nextIndex = lastIndex + 1;
    const next = Path.appendAt(path, nextIndex, ...clone);

    // Move selection to the newly created items.
    if (this.editMode === EditMode.Single) {
      Path.selectDistinct(next, this.singleSelectionIndex = nextIndex, true);
    } else if (this.editMode === EditMode.Group) {
      Path.selectAll(next, false);
      for (let i = nextIndex; i < nextIndex + clone.length; i++) {
        Path.selectItem(next, i, true);
      }
      this.groupSelectionIndices = Path.getSelectedIndices(next);
    }

    this.path = next;
    this.onPathModelChange();
  }
}
