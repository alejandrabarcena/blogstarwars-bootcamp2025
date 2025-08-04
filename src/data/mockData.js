// Mock data for instant loading
export const mockFilms = [
  {
    uid: "1",
    name: "A New Hope",
    type: "films",
    properties: {
      title: "A New Hope",
      episode_id: 4,
      director: "George Lucas",
      producer: "Gary Kurtz, Rick McCallum",
      release_date: "1977-05-25"
    }
  },
  {
    uid: "2",
    name: "The Empire Strikes Back",
    type: "films",
    properties: {
      title: "The Empire Strikes Back",
      episode_id: 5,
      director: "Irvin Kershner",
      producer: "Gary Kurtz, Rick McCallum",
      release_date: "1980-05-17"
    }
  },
  {
    uid: "3",
    name: "Return of the Jedi",
    type: "films",
    properties: {
      title: "Return of the Jedi",
      episode_id: 6,
      director: "Richard Marquand",
      producer: "Howard G. Kazanjian, George Lucas, Rick McCallum",
      release_date: "1983-05-25"
    }
  },
  {
    uid: "4",
    name: "The Phantom Menace",
    type: "films",
    properties: {
      title: "The Phantom Menace",
      episode_id: 1,
      director: "George Lucas",
      producer: "Rick McCallum",
      release_date: "1999-05-19"
    }
  },
  {
    uid: "5",
    name: "Attack of the Clones",
    type: "films",
    properties: {
      title: "Attack of the Clones",
      episode_id: 2,
      director: "George Lucas",
      producer: "Rick McCallum",
      release_date: "2002-05-16"
    }
  },
  {
    uid: "6",
    name: "Revenge of the Sith",
    type: "films",
    properties: {
      title: "Revenge of the Sith",
      episode_id: 3,
      director: "George Lucas",
      producer: "Rick McCallum",
      release_date: "2005-05-19"
    }
  }
];

export const mockCharacters = [
  {
    uid: "1",
    name: "Luke Skywalker",
    type: "people",
    properties: {
      height: "172",
      mass: "77",
      hair_color: "blond",
      skin_color: "fair",
      eye_color: "blue",
      birth_year: "19BBY",
      gender: "male"
    }
  },
  {
    uid: "2",
    name: "C-3PO",
    type: "people",
    properties: {
      height: "167",
      mass: "75",
      hair_color: "n/a",
      skin_color: "gold",
      eye_color: "yellow",
      birth_year: "112BBY",
      gender: "n/a"
    }
  },
  {
    uid: "3",
    name: "R2-D2",
    type: "people",
    properties: {
      height: "96",
      mass: "32",
      hair_color: "n/a",
      skin_color: "white, blue",
      eye_color: "red",
      birth_year: "33BBY",
      gender: "n/a"
    }
  },
  {
    uid: "4",
    name: "Darth Vader",
    type: "people",
    properties: {
      height: "202",
      mass: "136",
      hair_color: "none",
      skin_color: "white",
      eye_color: "yellow",
      birth_year: "41.9BBY",
      gender: "male"
    }
  },
  {
    uid: "5",
    name: "Leia Organa",
    type: "people",
    properties: {
      height: "150",
      mass: "49",
      hair_color: "brown",
      skin_color: "light",
      eye_color: "brown",
      birth_year: "19BBY",
      gender: "female"
    }
  },
  {
    uid: "10",
    name: "Obi-Wan Kenobi",
    type: "people",
    properties: {
      height: "182",
      mass: "77",
      hair_color: "auburn, white",
      skin_color: "fair",
      eye_color: "blue-gray",
      birth_year: "57BBY",
      gender: "male"
    }
  }
];

export const mockPlanets = [
  {
    uid: "1",
    name: "Tatooine",
    type: "planets",
    properties: {
      diameter: "10465",
      rotation_period: "23",
      orbital_period: "304",
      gravity: "1 standard",
      population: "200000",
      climate: "arid",
      terrain: "desert",
      surface_water: "1"
    }
  },
  {
    uid: "2",
    name: "Alderaan",
    type: "planets",
    properties: {
      diameter: "12500",
      rotation_period: "24",
      orbital_period: "364",
      gravity: "1 standard",
      population: "2000000000",
      climate: "temperate",
      terrain: "grasslands, mountains",
      surface_water: "40"
    }
  },
  {
    uid: "3",
    name: "Yavin IV",
    type: "planets",
    properties: {
      diameter: "10200",
      rotation_period: "24",
      orbital_period: "4818",
      gravity: "1 standard",
      population: "1000",
      climate: "temperate, tropical",
      terrain: "jungle, rainforests",
      surface_water: "8"
    }
  },
  {
    uid: "4",
    name: "Hoth",
    type: "planets",
    properties: {
      diameter: "7200",
      rotation_period: "23",
      orbital_period: "549",
      gravity: "1.1 standard",
      population: "unknown",
      climate: "frozen",
      terrain: "tundra, ice caves, mountain ranges",
      surface_water: "100"
    }
  },
  {
    uid: "5",
    name: "Dagobah",
    type: "planets",
    properties: {
      diameter: "8900",
      rotation_period: "23",
      orbital_period: "341",
      gravity: "N/A",
      population: "unknown",
      climate: "murky",
      terrain: "swamp, jungles",
      surface_water: "8"
    }
  }
];

export const mockStarships = [
  {
    uid: "2",
    name: "CR90 corvette",
    type: "starships",
    properties: {
      model: "CR90 corvette",
      starship_class: "corvette",
      manufacturer: "Corellian Engineering Corporation",
      cost_in_credits: "3500000",
      length: "150",
      crew: "30-165",
      passengers: "600",
      max_atmosphering_speed: "950",
      hyperdrive_rating: "2.0"
    }
  },
  {
    uid: "3",
    name: "Star Destroyer",
    type: "starships",
    properties: {
      model: "Imperial I-class Star Destroyer",
      starship_class: "Star Destroyer",
      manufacturer: "Kuat Drive Yards",
      cost_in_credits: "150000000",
      length: "1,600",
      crew: "47,060",
      passengers: "n/a",
      max_atmosphering_speed: "975",
      hyperdrive_rating: "2.0"
    }
  },
  {
    uid: "10",
    name: "Millennium Falcon",
    type: "starships",
    properties: {
      model: "YT-1300 light freighter",
      starship_class: "Light freighter",
      manufacturer: "Corellian Engineering Corporation",
      cost_in_credits: "100000",
      length: "34.37",
      crew: "4",
      passengers: "6",
      max_atmosphering_speed: "1050",
      hyperdrive_rating: "0.5"
    }
  },
  {
    uid: "12",
    name: "X-wing",
    type: "starships",
    properties: {
      model: "T-65 X-wing",
      starship_class: "Starfighter",
      manufacturer: "Incom Corporation",
      cost_in_credits: "149999",
      length: "12.5",
      crew: "1",
      passengers: "0",
      max_atmosphering_speed: "1050",
      hyperdrive_rating: "1.0"
    }
  }
];

export const mockVehicles = [
  {
    uid: "4",
    name: "Sand Crawler",
    type: "vehicles",
    properties: {
      model: "Digger Crawler",
      vehicle_class: "wheeled",
      manufacturer: "Corellia Mining Corporation",
      cost_in_credits: "150000",
      length: "36.8",
      crew: "46",
      passengers: "30",
      max_atmosphering_speed: "30"
    }
  },
  {
    uid: "6",
    name: "T-16 skyhopper",
    type: "vehicles",
    properties: {
      model: "T-16 skyhopper",
      vehicle_class: "repulsorcraft",
      manufacturer: "Incom Corporation",
      cost_in_credits: "14500",
      length: "10.4",
      crew: "1",
      passengers: "1",
      max_atmosphering_speed: "1200"
    }
  },
  {
    uid: "7",
    name: "X-34 landspeeder",
    type: "vehicles",
    properties: {
      model: "X-34 landspeeder",
      vehicle_class: "repulsorcraft",
      manufacturer: "SoroSuub Corporation",
      cost_in_credits: "10550",
      length: "3.4",
      crew: "1",
      passengers: "1",
      max_atmosphering_speed: "250"
    }
  }
];

export const mockSpecies = [
  {
    uid: "1",
    name: "Human",
    type: "species",
    properties: {
      classification: "mammal",
      designation: "sentient",
      average_height: "180",
      average_lifespan: "120",
      skin_colors: "caucasian, black, asian, hispanic",
      hair_colors: "blonde, brown, black, red",
      eye_colors: "brown, blue, green, hazel, grey, amber",
      language: "Galactic Basic"
    }
  },
  {
    uid: "2",
    name: "Droid",
    type: "species",
    properties: {
      classification: "artificial",
      designation: "sentient",
      average_height: "n/a",
      average_lifespan: "indefinite",
      skin_colors: "n/a",
      hair_colors: "n/a",
      eye_colors: "n/a",
      language: "n/a"
    }
  },
  {
    uid: "3",
    name: "Wookie",
    type: "species",
    properties: {
      classification: "mammal",
      designation: "sentient",
      average_height: "210",
      average_lifespan: "400",
      skin_colors: "gray",
      hair_colors: "black, brown",
      eye_colors: "blue, green, yellow, brown, golden, red",
      language: "Shyriiwook"
    }
  }
];