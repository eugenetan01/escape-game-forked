db.stepdefinition.insertMany([
  {
    _id: 0,
    intro: [
      "Once again, you worked late tonight. It is raining, a light but constant drizzle that penetrates your clothes and makes you cold to the bone. No wonder the streets are empty. You hurry along the wet pavement, thinking about the frozen chicken tikka you'll have in a few minutes, when suddenly a black van screeches to a halt next to you, splashing cold water on your shins.",
      "You barely have time to turn towards the offending vehicle when the slide door slams open, three men in black clothes and motorbike helmets jump out and pin you to the ground. You are too surprised to even think about fighting back, and anyway a needle pierces your thigh. You vaguely feel the men carrying you bodily inside the van as you fall into unconsciousness.",
      "You wake up groggy. You are dry now, presumably you have been thrown into this… warehouse? for a few hours. You stagger to your feet. From the echoes, you feel the place is vast, but it is plunged in darkness; only one light is shining in front of you, illuminating a folding table with a plastic chair. On top of it, a single laptop is open.",
      'You try turning it on. Two windows appear: one is a database shell, the other prompts you for a code. You turn over the laptop: underneath, you find a Post-it note on which is scribbled: "Code = quantity of shipment from Mauritius to Bangladesh and material transported was Thorium".',
    ],
    instructions: [
      "You must find the code. Maybe it is hidden in the database?",
    ],
    closing:
      "A siren goes off, and the lights turn on in the warehouse. A door open on the far side, from which enters a man in a dapper white suit…",
    input: "text",
    validator: "valueCheck",
    points: 10,
    hint: "Use an aggregation query. Be careful about how each word is spelled.",
    solution: "40",
    pointsWithHint: 5,
    next: 1,
  },
  {
    _id: 1,
    intro: [
      '"You may call me… Mr White, let us say," the man in white says. "I work for a… discrete government agency. Let it just be said that we are the final guardians of the free world. We have recently detected a shadowy organization which aims at destroying democratic institutions. One of our agents managed to exfiltrate this computer from the enemy, but sadly perished before giving us access. Thorium is a harmful virus that has been spread all over the world, and could kill millions of lives. Unfortunately, none of our agents alive today has the necessary advanced skills to find out how many capsules of the virus were spread. Which is where you come in the picture."',
    ],
    instructions: [
      "You need to find the correct total quantity of Thorium spread around the world. You must find a way to search for all of them at once.",
    ],
    closing:
      '"Excellent! You may consider yourself a part of our team… We call ourselves the Dry Cleaners. It\'s not our official name, of course, but that is an official secret, so I am not at liberty to divulge it to you. Follow me for your induction ceremony."',
    input: "text",
    validator: "valueCheck",
    points: 20,
    hint: "find the total quantity of thorium",
    solution: "287402",
    pointsWithHint: 10,
    next: 2,
  },
  {
    _id: 2,
    intro: [
      "In lieu of a ceremony, Mr White just got you to sign a blank paper in triplicate. Apparently, your secret rating didn't extend to reading your own terms of employment. Well, if it gets you out of this warehouse sooner… The main feature in the next room was a replica of the Doomsday Clock, set to 11:57pm. \"Don't worry about it,\" White said. \"It's been stuck there since… ah, I can't tell you. Anyway, this is what we know. The opposition - you can call them SPIRIT - has maintained uncovered someone has hacked into their database, and changed the material Thorium into many different variations to throw us off",
    ],
    instructions: [
      "The database contains Thorium shipments spelt with many variations and errors to throw us off! We need to quickly find out exactly how much Thorium was shipped out for our agents to intercept the shipments",
    ],
    closing:
      '"Thanks to you, a friendly government will be able to find the Thorium shipments and intercept them before it is released. All thanks to you! But now we need to know, how is SPIRIT able to operate one step ahead of us?"',
    input: "text",
    validator: "valueCheck",
    points: 30,
    hint: "There is a way in Atlas to perform fuzzy text search.",
    solution: "1780885",
    pointsWithHint: 20,
    next: 3,
  },
  {
    _id: 3,
    intro: [
      'While you were busy thinking, one of our agents managed to infiltrate a SPIRIT cell and sent us a coded message. "It seems there is a double agent in our midst.. One of our agents acted as a receiver for a Thorium shipment for SPIRIT" That was all we managed to get. Now we know why SPIRIT was able to beat us so far along. But Who is this double agent? Finding this person would mean exposing the mastermind behind the schemes of SPIRIT',
    ],
    instructions: [
      "There is a huge list of Thorium shipments. How are you going to find which agent double crossed us?",
    ],
    closing:
      '"Of course! We did have our eye on Padma, but could not prove anything. Thanks to you, a friendly government will be able to arrest him and, ah, take him out of circulation, if you get my meaning. The free world thanks you!"',
    input: "text",
    points: 20,
    hint: "There is something unusual about the agents who were attached to investigate the Thorium shipments.",
    solution: "Padma Patil",
    pointsWithHint: 10,
    next: 4,
    validator: "valueCheck",
  },
  {
    _id: 4,
    intro: [
      "After Padma was captured, we received word that Padma was interrogated and he revealed a crucial piece of information. He appeared to have been the right hand of the mastermind of the whole operation. Finding the mastermind means ending the whole of SPIRIT. Even Padma doesn't know who the real boss is, but he did reveal he has been receiving large amounts of shipments in the last 7 days in small batches and quantities to avoid detection. Finding who made the most shipments in the last 7 days would bring us to capture the boss behind SPIRIT.",
    ],
    instructions: [
      "The database contains a list of shipments. Sometimes, instead of a large suspicious shipment, the enemy made a high number of smaller shipments close in time. Find the person who received the most shipments in a sliding 7-day window using the $setWindowFields operator",
    ],
    closing:
      '"Of course! we had our eye on Fluffy. But thanks to you, our agents are on their way to capture Fluffy and we can finally get rid of SPIRIT entirely all the way starting from the top! You just saved the world!"',
    input: "text",
    validator: "valueCheck",
    points: 20,
    hint: "Moving sums and averages can be computed thanks to features specific to temporal data. Will you find the correct one?",
    solution: "Fluffy",
    pointsWithHint: 10,
    next: 5,
  },
  {
    _id: 5,
    intro: [
      "The man in white shows you a door that was previously hidden. You blink. How did you not notice it before? The room beyond is soaked in a blinding light, so you cannot see what awaits you. A sudden doubt grips your stomach.",
      '"How can I be sure this is not another of your tricks?", you ask.',
      '"Come now, Agent, would I bring harm to my most precious asset?"',
      "You realize White didn't really answer the question, but what do you have to lose? It's not like you have a choice. You enter the white room. The door slams shut behind you. The light hurts your eyes, tears blur your vision. Grasping at the walls, you try to call for help, but an acrid taste fills your mouth. Your head spins. You collapse on the ground. Barely conscious, you are distantly aware of an opening door. Voices, muffled – probably by gas masks.",
      '"Take them," says White. "You know where…"',
      "You want to protest, but are too weak. You faint when they haul you onto a gurney.",
    ],
    instructions: [""],
    terminal: true,
  },
]);
