// constants/resources.ts

export type ResourceDef = {
  id: string;
  title: string;
  asset: any;
};

export const RESOURCE_DEFS: ResourceDef[] = [
  {
    id: 'cityecho',
    title: 'City Echo',
    asset: require('../assets/resources/CityEcho.txt'),
  },
  {
    id: 'mountainsteps',
    title: 'Mountain Steps',
    asset: require('../assets/resources/MountainSteps.txt'),
  },
  {
    id: 'oceannotes',
    title: 'Ocean Notes',
    asset: require('../assets/resources/OceanNotes.txt'),
  },
  {
    id: 'randomone',
    title: 'Random One',
    asset: require('../assets/resources/RandomOne.txt'),
  },
  {
    id: 'silentlibrary',
    title: 'Silent Library',
    asset: require('../assets/resources/SilentLibrary.txt'),
  },
];
