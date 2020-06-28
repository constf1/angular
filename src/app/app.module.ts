import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

/**
 * Routes:
 */
const appRoutes: Routes = [
  {
    path: 'freecell-demo',
    loadChildren: () => import('./freecell/freecell.module').then(m => m.FreecellModule)
  },
  {
    path: 'school-demo',
    loadChildren: () => import('./school/school.module').then(m => m.SchoolModule)
  },

  { path: '', redirectTo: '/freecell-demo', pathMatch: 'full' },
  { path: '**', redirectTo: '/freecell-demo' }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {
      // enableTracing: true, // <-- debugging purposes only
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
