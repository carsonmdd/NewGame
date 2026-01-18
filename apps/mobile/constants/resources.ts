// constants/resources.ts

export type ResourceDef = {
  rid: number;
  fileType: string;
  title: string;
  content: string;
  description: string;
  date: string;
  creator: number;
  author: string;
};

export const RESOURCE_DEFS: ResourceDef[] = [
  {
  rid: 1,
  fileType: "txt",
  title: "City Echo",
  content: require("../assets/resources/CityEcho.txt"),
  description: "A description of text",
  date: Date(),
  creator: 1,
  author: "Fredick Figgle Bottom",
},
{
  rid: 2,
  fileType: "txt",
  title: "Mountain Steps",
  content: require("../assets/resources/MountainSteps.txt"),
  description: "A description of text",
  date: Date(),
  creator: 1,
  author: "Fredick Figgle Bottom",
},
{
  rid: 3,
  fileType: "txt",
  title: "Ocean Notes",
  content: require("../assets/resources/OceanNotes.txt"),
  description: "A description of text",
  date: Date(),
  creator: 1,
  author: "Fredick Figgle Bottom",
},
{
  rid: 4,
  fileType: "txt",
  title: "Random One",
  content: require("../assets/resources/RandomOne.txt"),
  description: "A description of text",
  date: Date(),
  creator: 1,
  author: "Fredick Figgle Bottom",
},
{
  rid: 5,
  fileType: "txt",
  title: "Silent Library",
  content: require("../assets/resources/SilentLibrary.txt"),
  description: "A description of text",
  date: Date(),
  creator: 1,
  author: "Fredick Figgle Bottom",
},

];
