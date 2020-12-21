interface Frame {
  left: number;
  right?: number;
  top: number;
  bottom?: number;
  width: number;
}

interface Image {
  src: string;
  frames: Frame[];
}

export const IMAGES: { [key: string]: Image[] } = {
  dances: [
    {
      src: 'kitten-dance.webp',
      frames: [
        { left: 116, right: 270, top: 560, bottom: 588, width: 180 },  // floor front left
        { left: 600, right: 710, top: 560, bottom: 588, width: 180 },  // floor front right

        { left: 180, right: 284, top: 530, bottom: 568, width: 150 },  // floor middle left
        { left: 618, right: 720, top: 530, bottom: 568, width: 150 },  // floor  middle right

        { left: 226, right: 330, top: 512, bottom: 540, width: 110 },  // floor back left
        { left: 622, right: 750, top: 512, bottom: 540, width: 110 },  // floor back right

        { left: 212, right: 738, top: 418, width: 100 },  // blackboard
      ]
    },
    {
      src: 'rabbit-dance.webp',
      frames: [
        { left: 100, right: 280, top: 554, bottom: 582, width: 200 },  // floor front left
        { left: 580, right: 676, top: 554, bottom: 582, width: 200 },  // floor front right

        { left: 200, right: 280, top: 530, bottom: 568, width: 160 },  // floor middle left
        { left: 618, right: 712, top: 530, bottom: 568, width: 160 },  // floor  middle right

        { left: 218, right: 338, top: 500, bottom: 520, width: 140 },  // floor back left
        { left: 584, right: 724, top: 500, bottom: 528, width: 140 },  // floor back right

        { left: 210, right: 710, top: 403, width: 120 },  // blackboard
      ]
    },
    {
      src: 'doggy-dance.webp',
      frames: [
        { left: 230, right: 730, top: 420, width: 100 },  // blackboard

        { left: 224, right: 320, top: 510, bottom: 554, width: 120 },  // floor back left
        { left: 620, right: 754, top: 510, bottom: 554, width: 120 },  // floor back right

        { left: 200, right: 292, top: 554, bottom: 578, width: 140 },  // floor middle left
        { left: 620, right: 736, top: 554, bottom: 578, width: 140 },  // floor  middle right

        { left: 180, right: 290, top: 580, bottom: 610, width: 160 },  // floor front left
        { left: 610, right: 712, top: 580, bottom: 610, width: 160 },  // floor front right
      ]
    }
  ],
  jumps: [
    {
      src: 'kitten-jump.webp',
      frames: [
        { left: 870, top: 117, width: 58 },  // bulletin board
        { left: 966, top: 464, width: 52 },  // pot
        { left: 60, right: 68, top: 22, width: 72 },  // teacher
        { left: 900, top: 450, width: 60 },  // girl
        { left: 108, top: 230, width: 100 },  // teacher's pocket
        { left: 846, right: 954, top: 0, width: 68 },  // bulletin board top
        { left: 228, right: 742, top: 400, width: 80 },  // blackboard
        { left: 0, right: 862, top: 550, width: 160 },  // front
      ]
    },
    {
      src: 'doggy-jump.webp',
      frames: [
        { left: 870, top: 117, width: 58 },  // bulletin board
        { left: 966, top: 464, width: 52 },  // pot
        { left: 130, right: 136, top: 17, width: 80 },  // teacher's head
        { left: 900, top: 450, width: 60 },  // girl
        { left: 108, top: 230, width: 100 },  // teacher's pocket
        { left: 846, right: 954, top: 0, width: 68 },  // bulletin board top
        { left: 228, right: 742, top: 400, width: 80 },  // blackboard
        { left: 0, right: 862, top: 550, width: 160 },  // front
      ]
    },
    {
      src: 'rabbit-jump.webp',
      frames: [
        { left: 870, top: 114, width: 58 },  // bulletin board
        { left: 970, top: 460, width: 48 },  // pot
        { left: 138, right: 142, top: 10, width: 72 },  // teacher's head
        { left: 898, top: 435, width: 60 },  // girl
        { left: 108, top: 230, width: 84 },  // teacher's pocket
        { left: 846, right: 964, top: 0, width: 58 },  // bulletin board top
        { left: 228, right: 742, top: 382, width: 80 },  // blackboard
        { left: 0, right: 862, top: 510, width: 160 },  // front
      ]
    }
  ],
  looks: [
    {
      src: 'foxy-look.webp',
      frames: [
        { left: 846, top: 0, width: 64 },  // blackboard top right corner
        { left: 228, top: 394, width: 80 },  // blackboard bottom left corner
        { left: 0, top: 530, bottom: 556, width: 100 },  // floor left corner middle
        { left: 0, top: 560, bottom: 586, width: 120 },  // floor left corner front
      ]
    },
    {
      src: 'tortoise-look.webp',
      frames: [
        { left: 690, top: 398, width: 140 },  // blackboard bottom right corner
        { left: 690, top: 556, width: 200 },  // floor right corner middle
      ]
    },
    {
      src: 'rabbit-sneeze.webp',
      frames: [
        { left: 676, top: 388, width: 150 },  // blackboard bottom right corner
        { left: 692, top: 540, bottom: 584, width: 180 },  // floor right corner middle
        { left: 904, top: 0, width: 120 },  // bulletin board top
      ]
    }
  ],
  booms: [
    {
      src: 'boom-1.webp',
      frames: [
        { left: 0, right: 588, top: 0, bottom: 588, width: 588 }
      ]
    }
  ]
};

export const ASSETS_URL = 'assets/school/missing-letters/';

export const WIN_AUDIOS = ['snare-flute', 'sneaky-xylophone', 'silly-baritone', 'swell-trombone', 'gramophone-1'] as const;
