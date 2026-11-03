/* Each slot is one story beat. The first option whose flag the player has set wins;
   otherwise the "lean" option that best matches the player's current traits;
   otherwise the default (no flag, no lean). Every option in a slot happens at the same
   moment in the story, so the narrative keeps flowing whichever one appears.
   Answers: [text, weights, flag?]. */
var ARCS = [
  { name: "Origin arc", color: "#ff5ca8", sub: "Your first day" },
  { name: "Training arc", color: "#ff9a2e", sub: "Getting stronger" },
  { name: "Tournament arc", color: "#ffd23f", sub: "The big day" },
  { name: "Slice-of-life arc", color: "#3ccfa8", sub: "A normal week. Sort of." },
  { name: "Dark arc", color: "#a77bff", sub: "Things fall apart" },
  { name: "Final arc", color: "#ff4d4d", sub: "The ending" }
];

var SLOTS = [
/* ================= Origin arc: your first day ================= */
{ arc: 0, at: [8, 0, "Day 1"], qs: [
  { q: "Episode one. How does your story open?", a: [
    ["Running late, toast in your mouth, about to crash into someone.", "x2 h1 e1", "toast"],
    ["Up on the school rooftop before class, watching clouds.", "c3 q1 s1", "roof"],
    ["Shouting your dream at the sky so the whole town hears.", "d3 e2 g1", "dream"],
    ["Glaring at the new transfer student at the school gate.", "t4 e1", "glare"],
    ["Walking in behind a book, hoping nobody says hello.", "q4 b1", "book"],
    ["Smiling sweetly. The narrator says you're the one to watch.", "s3 c1 h1", "smile"]
  ]}
]},
{ arc: 0, at: [8, 10, "Day 1"], qs: [
  { flag: "toast", tag: "Toast-in-mouth meet-cute", q: "You crash into someone at the corner. Toast everywhere. They look annoyed.", a: [
    ["Apologise ten times and offer them the other half of your toast.", "h3 q1"],
    ["\"Watch where you're going!\" Even though it was your fault.", "t3 g1"],
    ["Laugh, grab their hand and drag them to school with you.", "x2 h1 e1"],
    ["They dropped a strange pendant. You quietly pocket it.", "s2 b2"]
  ]},
  { flag: "roof", tag: "Rooftop loner hours", q: "The rooftop door creaks open. Someone has found your spot.", a: [
    ["Ignore them. Maybe they'll leave.", "c3 q1"],
    ["\"This is MY spot.\" You don't move an inch.", "t3 e1"],
    ["Scoot over and offer them some of your bread.", "h3 q1"],
    ["Strike a mysterious pose, as if you'd been expecting them.", "x2 e2"]
  ]},
  { flag: "dream", tag: "Dream declared, haters assembled", q: "A passer-by laughs at your dream in front of everyone.", a: [
    ["Laugh louder. Then say it again, twice as loud.", "g2 d2 e1"],
    ["Challenge them to a fight. Right here, right now.", "g3 t1"],
    ["Say nothing. Remember their face.", "s3 d1"],
    ["Ask what their dream is. Maybe they don't have one.", "h2 b1 c1"]
  ]},
  { flag: "glare", tag: "Rival flag raised", q: "The transfer student you glared at gets the seat right next to yours. Of course.", a: [
    ["\"Don't talk to me.\" Then lend them an eraser anyway.", "t3 h2"],
    ["Start a silent rivalry. You will beat their test scores.", "d3 t1 b1"],
    ["Study them closely. Habits, weaknesses, everything.", "b2 s2"],
    ["Forget the glare and become best friends by lunch.", "h2 x2"]
  ]},
  { flag: "book", tag: "Bookworm in hiding", q: "Someone sits down beside you and asks what you're reading.", a: [
    ["Mumble the title and turn very red.", "q3 h1"],
    ["Hand them your spare copy. You always carry one.", "h2 b2"],
    ["Close the book. \"It's a bit advanced for you.\"", "t2 b1 e1"],
    ["Give them a forty-minute summary without breathing.", "b2 x2"]
  ]},
  { flag: "smile", tag: "Suspiciously nice smile", q: "A classmate quietly asks you for help with something embarrassing.", a: [
    ["Help them, and keep their secret forever.", "h3 c1"],
    ["Help them. Now they owe you one.", "s3 b1"],
    ["Tease them until they turn bright red. Then help.", "x2 s1 t1"],
    ["Make the problem quietly disappear. Don't ask how.", "s2 c2"]
  ]},
  { q: "You arrive at your new classroom.", a: [
    ["Walk in like you own the place.", "e3 c1"],
    ["Slip in and take the back seat by the window.", "c2 q2"],
    ["Say good morning to everyone, by name.", "h3"],
    ["Trip over the doorway. Strong start.", "x3"]
  ]}
]},
{ arc: 0, at: [9, 0, "Day 1"], qs: [
  { q: "Homeroom. The teacher asks everyone to introduce themselves.", a: [
    ["\"I'm going to be the greatest ever. Remember my name!\"", "e3 d2"],
    ["Just your name. Then you sit down.", "c3 q1"],
    ["A joke that lands way better than expected.", "x2 e2"],
    ["Something so kind the whole class decides to like you.", "h3"],
    ["\"...Do I have to?\" You say your name to the floor.", "t2 q2"]
  ]}
]},
{ arc: 0, at: [12, 30, "Day 1"], qs: [
  { flag: "toast", tag: "Toast callback", q: "Lunch. The person you crashed into this morning sits down right across from you.", a: [
    ["Slide them your dessert. Peace offering.", "h3"],
    ["\"Why are you following me?!\" You let them stay.", "t3 h1"],
    ["Return their pendant. Or don't, yet.", "s2 b1"],
    ["Challenge them to a who-eats-faster contest.", "x2 g2"]
  ]},
  { lean: "t", tag: "Tsun levels critical", q: "Lunch. Your childhood friend hands you a lunch box. In front of everyone.", a: [
    ["\"I didn't ask for this!\" You eat every single bite.", "t4 h1"],
    ["Say thanks. Your ears go completely red.", "h2 q2"],
    ["Critique the seasoning in detail. Then ask what's in tomorrow's.", "b2 t2"],
    ["Swap it for yours. Fair's fair.", "x2 c1"]
  ]},
  { lean: "s", tag: "Villain arc foreshadowing", q: "Lunch. Your classmate's phone lights up with a very juicy notification. They didn't notice.", a: [
    ["Remember every word. Information is power.", "s3 b2"],
    ["Mention it casually later and watch them panic.", "s2 x2"],
    ["Look away. Not your business.", "h2 c2"],
    ["Tell them right away so they can hide it.", "h3"]
  ]},
  { q: "Lunch break. Where are you eating?", a: [
    ["Centre table, loudest group, telling the best story.", "e3 h1"],
    ["Alone in an empty classroom. Peace at last.", "c2 q2"],
    ["Wherever your friends are. You brought extra for them.", "h3"],
    ["In the library, still studying.", "b2 d2"],
    ["You skipped lunch to go and train.", "d3 g1"]
  ]}
]},
{ arc: 0, at: [15, 30, "Day 1"], qs: [
  { lean: "q", tag: "Social battery: 3%", q: "Club fair. Everyone is shouting at you to join their club.", a: [
    ["Join the quietest club you can find.", "q2 b2"],
    ["Panic and sign up for the first table you see.", "q2 x2"],
    ["Join the club with one lonely member left.", "h3 q1"],
    ["Start your own club. Members: one.", "c2 t1 e1"]
  ]},
  { lean: "x", tag: "Gremlin mode unlocked", q: "After class, you poke around the chemistry lab and accidentally summon something.", a: [
    ["Name it. Feed it. It's yours now.", "x2 h2"],
    ["Ask it for powers. Dark ones, ideally.", "s2 x1 e1"],
    ["Write down exactly what you did so you can do it again.", "b3 d1"],
    ["Close the door and walk away whistling.", "c3 x1"]
  ]},
  { q: "After school, every club is recruiting. Which one do you join?", a: [
    ["A sports club. You'll be captain by spring.", "g2 d2 e1"],
    ["The student council. That's where the power is.", "s2 b2 e1"],
    ["The weird occult club with three members.", "x2 s1 q1"],
    ["The cooking club. Someone has to feed everyone.", "h3 d1"],
    ["The go-home club. Nobody can stop you.", "c3 x1"]
  ]}
]},
{ arc: 0, at: [17, 45, "Day 1"], qs: [
  { lean: "h", tag: "Pure cinnamon roll", q: "On your walk home, a crying kid has lost a balloon in a very tall tree.", a: [
    ["Climb the tree. You'll work out the coming-down part later.", "g2 h2"],
    ["Buy them a new balloon, and one for their friend.", "h3 e1"],
    ["Sit with them until their parents arrive.", "h2 q1 c1"],
    ["\"Stop crying. ...Here. Take my lucky charm instead.\"", "t3 h2"]
  ]},
  { lean: "g", tag: "Delinquent energy", q: "On your walk home, a gang of delinquents blocks the road.", a: [
    ["Walk straight through them.", "g3 c1"],
    ["Challenge their leader to a one-on-one.", "g2 d1 e2"],
    ["Talk them into joining your side.", "b2 h1 s1"],
    ["Take the long way round. Fighting is a hassle.", "c2 x1"]
  ]},
  { at: [18, 0, "Day 1"], q: "A mysterious old stranger stops you on the walk home: \"You have potential. Let me train you.\"", a: [
    ["\"Yes. How soon can I be the strongest?\"", "d3 g1 e1"],
    ["\"What's the catch?\"", "b3 c1"],
    ["Say no, then sneak back later to steal their secret scroll.", "s3 x2"],
    ["\"Can my friend come too?\"", "h4"],
    ["\"I-it's not like I need training. ...When do we start?\"", "t3 d1"]
  ]}
]},

/* ================= Training arc ================= */
{ arc: 1, at: [6, 0, "Training · day 1"], qs: [
  { flag: "dream", tag: "Dream on record", q: "Your new teacher heard you shouting your dream yesterday. \"Say it again. Like you mean it.\"", a: [
    ["You shout it so loud birds fly away.", "e3 d2"],
    ["You say it quietly. It means more that way.", "c2 d2"],
    ["\"Why do you care?\" You say it anyway.", "t3 d1"],
    ["You say it, and add a dream for your friends too.", "h3 d1"]
  ]},
  { q: "First lesson. Your new teacher asks why you want to get stronger.", a: [
    ["To be the best. Simple.", "d3 e2"],
    ["To protect the people I love.", "h3 g1"],
    ["To prove everyone wrong.", "t2 d2 s1"],
    ["Honestly? It looked fun.", "x3 g1"],
    ["Someone made me come.", "c2 q2"]
  ]}
]},
{ arc: 1, at: [5, 0, "Training · day 3"], qs: [
  { lean: "d", tag: "Training montage addict", q: "Your training partner texts you before sunrise: \"skip today?\"", a: [
    ["\"No.\" You turn up at their door.", "d3 g1"],
    ["Go alone and send them a photo of your progress.", "d3 e1 t1"],
    ["\"Sure.\" More time for you to get ahead.", "d2 c1 s1"],
    ["Send them a terrible motivational meme.", "h2 x2"]
  ]},
  { q: "Your training partner keeps messing up and slowing you both down.", a: [
    ["Help them, patiently, for as long as it takes.", "h3 c1"],
    ["Leave them behind. Results matter.", "s2 d2"],
    ["Yell at them, then stay late to help.", "t3 h1"],
    ["Turn the drills into a game so they relax.", "x2 h2"],
    ["Quietly rework the plan around them.", "b2 c1"]
  ]}
]},
{ arc: 1, at: [16, 0, "Training · week 2"], qs: [
  { lean: "t", tag: "Rival arc heating up", q: "A rival from another school beats you in a sparring match. In front of everyone.", a: [
    ["\"I let you win. Obviously.\" You train until midnight.", "t3 d2"],
    ["Congratulate them, and mean it. Then train until midnight.", "h2 d2"],
    ["Note their technique. Next time is yours.", "b3 c1"],
    ["Challenge them to a rematch in something else. Karaoke.", "x3 e1"]
  ]},
  { lean: "q", tag: "Hiding behind the tallest friend", q: "A rival from another school points at you and demands a match. Everyone turns to look.", a: [
    ["Freeze. Then accept, very quietly.", "q3 d1"],
    ["Pretend they meant the person behind you.", "q2 x2"],
    ["Ask a friend to stand beside you. Then accept.", "h2 g1 q1"],
    ["Accept. The nerves make you sharper.", "c2 g2"]
  ]},
  { q: "A rival from another school shows up, and they're clearly stronger than you.", a: [
    ["Amazing. Finally, a real challenge.", "g3 d2"],
    ["You're jealous, so you double your training.", "d3 t1 s1"],
    ["Ask if they want to get lunch.", "h3 x1"],
    ["Watch how they do it, then copy it.", "b4"],
    ["Hope they don't notice you. Please don't notice you.", "q3 c1"]
  ]}
]},
{ arc: 1, at: [7, 0, "Training · week 3"], qs: [
  { q: "Cue the montage music. What does your montage show?", a: [
    ["A thousand push-ups in the rain.", "d3 g2"],
    ["You, reading every book in the library.", "b4"],
    ["Mostly napping. You're naturally gifted.", "c3 x1 e1"],
    ["A forbidden technique with a small, terrible cost.", "s3 d1 b1"],
    ["You teaching the younger kids what you've learned.", "h3 d1"]
  ]}
]},
{ arc: 1, at: [21, 0, "Training · week 3"], qs: [
  { lean: "s", tag: "The dark side is recruiting", q: "Your power awakens, and a shadowy organisation notices. They want to recruit you.", a: [
    ["Join, and quietly work your way to the top.", "s3 d2"],
    ["Join as a double agent. You have a plan.", "b3 s1"],
    ["Refuse. Then burn their headquarters down.", "g3 h1"],
    ["Ask about the uniform first.", "x2 e2"]
  ]},
  { lean: "x", tag: "Chaos goblin route", q: "Your power awakens, but it comes out of a magic wand you found with no instructions.", a: [
    ["Wave it immediately. Something explodes. Perfect.", "x4 g1"],
    ["Give your first spell a very long, very dramatic name.", "x2 e3"],
    ["Read the tiny print you just found on the handle.", "b3 c1"],
    ["Use it to make dinner for everyone.", "h3 x1"]
  ]},
  { q: "Your power finally awakens. What is it?", a: [
    ["Reading minds. Mostly for the gossip.", "x2 b2"],
    ["Being the strongest person alive.", "g2 d2 e1"],
    ["Healing anyone who needs it.", "h4"],
    ["Never feeling stressed about anything, ever.", "c4"],
    ["Everyone does exactly what you say.", "s3 b1 e1"],
    ["Invisibility. Finally, some peace.", "q3 c1"]
  ]}
]},
{ arc: 1, at: [18, 0, "Training · last day"], qs: [
  { lean: "e", tag: "Name in lights", q: "Your teacher says you need a fighter name for the tournament.", a: [
    ["Something with \"Ultimate\" and \"Legend\" in it.", "e3 x1"],
    ["Your real name. It'll be famous anyway.", "e2 d2"],
    ["No name. Let them wonder.", "c3 s1"],
    ["Something cute, so the kids can chant it.", "h3 e1"]
  ]},
  { lean: "q", tag: "Secret talent exposed", q: "Your friends beg you to show them your new move.", a: [
    ["\"It's not that good...\" (It's incredible.)", "q3 c1"],
    ["Show them, then hide behind them because everyone's looking.", "q2 h1 x1"],
    ["Show them once. Don't explain. Walk away.", "c3"],
    ["Teach it to them instead.", "h3 b1"]
  ]},
  { q: "Your signature move needs a name. How do you use it?", a: [
    ["Scream the name as loud as you possibly can.", "g2 e3"],
    ["Say nothing. Those who know, know.", "c4"],
    ["Explain exactly how it works, mid-fight.", "b3 e1 x1"],
    ["It has a different name every single time.", "x4"],
    ["\"I-it doesn't have a name! Stop asking!\"", "t3 q1"]
  ]}
]},

/* ================= Tournament arc ================= */
{ arc: 2, at: [9, 30, "Tournament day"], qs: [
  { q: "Tournament day. You walk out into a packed stadium. What's your entrance?", a: [
    ["Wave to the crowd like you already won.", "e3 h1"],
    ["Hands in pockets. Look bored.", "c3 s1"],
    ["Trip on the way in. Recover with a thumbs up.", "x3 h1"],
    ["Glare at your opponent's whole cheering section.", "t2 s2"],
    ["Walk straight to your spot without looking up.", "q3 d1"]
  ]}
]},
{ arc: 2, at: [10, 15, "Tournament day"], qs: [
  { q: "Before your first match, you spot someone in the stands picking on a younger kid.", a: [
    ["Jump the barrier and step in. There is no plan.", "g3 x1"],
    ["Go up, sit with the kid, and calm things down.", "h3 g1"],
    ["Find a clever way to embarrass the bully in front of everyone.", "b3 x1"],
    ["Give the bully one look. That's all it takes.", "c3 g1"],
    ["Film it. This could be useful leverage later.", "s3 b1"],
    ["\"I-it's not like I'm helping you! He was blocking my view.\"", "t3 g2"]
  ]}
]},
{ arc: 2, at: [11, 0, "Round one"], qs: [
  { lean: "h", tag: "Too kind for this tournament", q: "Round one. Your opponent is crying before the match even starts.", a: [
    ["Go and comfort them. Then fight fair.", "h3 g1"],
    ["\"Stop crying. You're making it hard to beat you.\"", "t3 h1"],
    ["It's a trick. You've seen this before.", "b2 c2"],
    ["Cry too. Out of solidarity.", "h2 x2"]
  ]},
  { lean: "s", tag: "No mercy route", q: "Round one. In the warm-up, you spot your opponent's secret injury.", a: [
    ["Aim for it. A win is a win.", "s4 d1"],
    ["Tell the referee. You want a fair fight.", "h2 g2"],
    ["Pretend you didn't see. Win anyway.", "c2 g1 d1"],
    ["Offer them a bandage. Then crush them.", "s2 h1 x1"]
  ]},
  { q: "Round one. The whole stadium is cheering for your opponent.", a: [
    ["Win them over. By the end, they'll chant your name.", "e3 h1 g1"],
    ["You don't hear them at all.", "c4"],
    ["You remember every face.", "s3 d1"],
    ["\"Hmph. Cheer for whoever you want. See if I care.\"", "t3 d1"],
    ["Wave at them. All this attention is rather flattering.", "x3 e1"]
  ]}
]},
{ arc: 2, at: [13, 0, "Quarter-final"], qs: [
  { q: "Quarter-final. The draw puts you against your best friend.", a: [
    ["Go all out. That's what respect looks like.", "g2 d3"],
    ["Quietly let them win. They need it more.", "h4"],
    ["You know all their weaknesses, and you use them.", "b2 s3"],
    ["Laugh, because this is going to be so much fun.", "x3 e1 g1"],
    ["\"Don't you dare go easy on me, idiot.\"", "t3 g1"]
  ]}
]},
{ arc: 2, at: [15, 30, "Semi-final"], qs: [
  { q: "Semi-final. You're losing badly and you can barely stand.", a: [
    ["Stand back up. Again and again.", "d2 g3"],
    ["Hear your friends cheering, and find one more push.", "h3 g1"],
    ["Change your whole strategy mid-fight.", "b3 c1"],
    ["Crack a joke to throw them off.", "x3 c1"],
    ["Get angry. Very, very angry.", "s2 t2 g1"]
  ]}
]},
{ arc: 2, at: [18, 0, "The final"], qs: [
  { flag: "glare", tag: "Rival rematch!", q: "The final. Your opponent is that transfer student from day one. Of course it is.", a: [
    ["\"I'll beat you this time. Got it?!\"", "t3 d2"],
    ["\"Let's both give it everything.\" You mean it.", "h2 g2"],
    ["You've studied every match they played. You're ready.", "b3 d1"],
    ["You turn up late, with snacks for both of you.", "x2 h2"]
  ]},
  { q: "The final. Your opponent walks over and offers a handshake.", a: [
    ["Shake it and mean it.", "h2 g2"],
    ["Ignore it. Talk with your fists.", "g3 c1"],
    ["Shake it, then whisper something unsettling.", "s3 x1"],
    ["\"D-don't think this makes us friends!\"", "t4"],
    ["Bow very politely, very nervously.", "q3 h1"]
  ]}
]},

/* ================= Slice-of-life arc: the week after ================= */
{ arc: 3, at: [7, 0, "Monday"], qs: [
  { q: "The tournament's over. Back to normal life. Your alarm goes off.", a: [
    ["You're already up. You've been at the gym since six.", "d3 g1"],
    ["Six snoozes, then sprint out with toast in your mouth.", "x3 h1"],
    ["You were awake anyway, reading something at 4 a.m.", "b3 c1"],
    ["Get up quietly and make breakfast for everyone.", "h3 c1"],
    ["Throw it across the room. It knows what it did.", "t2 x2"]
  ]}
]},
{ arc: 3, at: [22, 0, "Tuesday"], qs: [
  { lean: "e", at: [14, 0, "Tuesday"], tag: "All eyes on you", q: "You present your project to the whole class. The room is completely silent.", a: [
    ["Silence means they're impressed. Keep going.", "e3 c1"],
    ["Crack a joke. Someone has to.", "x3 e1"],
    ["Speed up and finish two minutes early.", "q3 d1"],
    ["Ask them a question so they have to join in.", "b2 h1 e1"]
  ]},
  { q: "A big assignment is due in twelve hours. What's going on?", a: [
    ["Finished it last week. You're reviewing it for fun.", "d3 b1"],
    ["Haven't started. Energy drink open. This is where you shine.", "x3 g1"],
    ["Helping a friend with theirs instead of doing yours.", "h3 x1"],
    ["Calm. You know exactly how long it takes.", "c3 b1"],
    ["Quietly panicking under a blanket.", "q3 h1"]
  ]}
]},
{ arc: 3, at: [15, 30, "Wednesday"], qs: [
  { lean: ["c", "t"], tag: "Confession event, mid-week", q: "After class, someone you barely know confesses their feelings to you.", a: [
    ["\"I see.\" You'll think about it for three months.", "c3 q1"],
    ["\"Wh-what?! Don't say weird things so suddenly!\"", "t3 h1"],
    ["Tease them until they regret it. Then say yes.", "x2 s1 h1"],
    ["Thank them kindly, and mean it.", "h3 c1"]
  ]},
  { q: "Group project meeting. What's your role?", a: [
    ["You make the plan and tell everyone what to do.", "b2 d2 e1"],
    ["You keep morale up and bring the snacks.", "h3 g1"],
    ["You do it all the night before and it's somehow great.", "c2 x2"],
    ["You quietly fix everyone's mistakes and tell no one.", "c2 b1 h1 q1"],
    ["You \"forget\" to check the group chat.", "x2 s1 q1"]
  ]}
]},
{ arc: 3, at: [23, 0, "Thursday"], qs: [
  { lean: ["g", "x"], tag: "Rage-quit risk", q: "Online match with random teammates. Your team is losing badly.", a: [
    ["Try harder. You'll carry them on your back.", "d3 g1"],
    ["Hype everyone up on voice chat.", "h2 e2"],
    ["Blame the lag. Loudly.", "x2 t2"],
    ["Take charge and call every play.", "b2 e2"],
    ["Mute everyone. Play in silence.", "c2 q2"]
  ]},
  { q: "It's late and you're hungry. What happens?", a: [
    ["Cook a full meal from scratch. You're a chef now.", "d2 h2"],
    ["Instant noodles, eaten standing up.", "x2 c1 q1"],
    ["Order the most expensive thing on the app. You deserve it.", "e3 s1"],
    ["Black coffee. Keep working.", "c3 d1"],
    ["Raid a sibling's or roommate's snacks.", "x2 g1 s1"]
  ]}
]},
{ arc: 3, at: [17, 30, "Friday"], qs: [
  { q: "Walking home in the rain, you find a stray kitten.", a: [
    ["It's coming home. It has a name now. It's family.", "h4"],
    ["Say you don't care, then secretly buy it food.", "t3 h2", "kitten"],
    ["Appoint it your second-in-command.", "x3 e1"],
    ["Hide it in your room and sneak it milk. Nobody can know.", "q2 h2"],
    ["Keep walking. It's a kitten.", "s2 c2"]
  ]}
]},
{ arc: 3, at: [21, 0, "Friday night"], qs: [
  { flag: "kitten", tag: "Caught being soft", q: "A classmate texts you a photo of yourself feeding that kitten. They're grinning.", a: [
    ["\"It was hungry! That's all! Delete that!\"", "t4 h1"],
    ["\"Yes. Her name is Princess. Want to meet her?\"", "h3 x1"],
    ["Leave them on read until they forget it happened.", "c2 s2"],
    ["Bribe them with snacks to keep quiet.", "b2 x1 s1"]
  ]},
  { lean: "q", tag: "Party? In this economy?", q: "You're invited to a party where you only know the host.", a: [
    ["Go, find the host's pet and stay with it all night.", "q3 h1"],
    ["Say you'll go. Cancel an hour before.", "q2 c1 x1"],
    ["Go, stay near the snacks, leave without saying goodbye.", "q2 c2"],
    ["Bring one friend as a human shield. It goes great.", "h2 q1 g1"]
  ]},
  { q: "Your friend cancels your plans an hour before. Honest reaction?", a: [
    ["Secret relief. Pyjamas on immediately.", "q2 c2"],
    ["\"No worries!\" You were really looking forward to it.", "h3 q1"],
    ["\"Fine. Whatever. I wasn't excited anyway.\"", "t3 s1"],
    ["Text five other people. The night will happen.", "e2 x2"],
    ["Use the time to get ahead on your goals.", "d3 b1"]
  ]}
]},
{ arc: 3, at: [11, 0, "Saturday"], qs: [
  { flag: "roof", tag: "Rooftop callback", q: "You go back up to your old rooftop spot. Someone is already there, with two drinks.", a: [
    ["Take one. Say nothing. It's nice.", "c2 h1 q1"],
    ["\"I didn't ask you to come.\" You drink it anyway.", "t3 h1"],
    ["Tell them something you've never told anyone.", "h3 q1"],
    ["Ask how they keep finding your spot. Suspicious.", "b2 s1"]
  ]},
  { lean: "t", tag: "Beach episode, tsun edition", q: "Beach day with friends. Someone says your outfit looks good.", a: [
    ["\"Wh-who said you could look?! Idiot!\"", "t4"],
    ["\"Obviously.\" A small victory pose.", "e3 t1"],
    ["\"Yours too.\" You both go quiet for a minute.", "h2 q2"],
    ["Push them into the sea. Affectionately.", "x3 t1"]
  ]},
  { lean: "c", at: [11, 42, "Sunday"], tag: "Read at 11:42", q: "You wake up to 47 unread messages.", a: [
    ["Read them all. Reply to none.", "c3 q1"],
    ["Reply \"ok\" to the group chat. That covers everything.", "c2 x1"],
    ["Turn the phone off and go back to sleep.", "c2 x1 q1"],
    ["Reply to each one personally. It takes three hours.", "h3 d1"]
  ]},
  { q: "A completely free day. What do you do?", a: [
    ["New city, no plan, see what happens.", "x2 g2"],
    ["Train, study or work on your goals.", "d4"],
    ["Games, anime and snacks. Do not disturb.", "q2 c2"],
    ["A big group hangout that you organised.", "e2 h2"],
    ["Plotting. Just generally plotting.", "s2 b2"]
  ]}
]},

/* ================= Dark arc ================= */
{ arc: 4, at: [8, 30, "Monday, again"], qs: [
  { lean: "h", tag: "Jealousy flags detected", q: "Something feels off. Your best friend has a new friend, and they're always together now.", a: [
    ["You're happy for them. You invite them both to dinner.", "h3 c1"],
    ["You're fine. You're totally fine. You're watching.", "s3 h2"],
    ["\"Hmph. I don't care who they hang out with.\" You care a lot.", "t3 h1"],
    ["You make three new friends to prove you're doing great.", "e2 x2"]
  ]},
  { q: "Something feels off. Someone presents your work as their own, in front of everyone.", a: [
    ["Call it out, right there, in front of everyone.", "g3 e1"],
    ["Smile. Collect evidence. Strike later.", "s3 b1"],
    ["Let it go. You know what you did.", "c3 h1"],
    ["\"Wow. ...I didn't even want credit anyway.\" (You did.)", "t3 q1"],
    ["Complain to your friends about it for a week.", "x2 h2"]
  ]}
]},
{ arc: 4, at: [17, 0, "Monday, again"], qs: [
  { q: "Then you find out why: someone you trusted has been working with the villain all along.", a: [
    ["Smile and stay close. They think you haven't noticed.", "s4 c1"],
    ["Try to understand why, and forgive them.", "h4"],
    ["Confront them at once, loudly.", "g3 x1"],
    ["Shrug and walk away. Their loss.", "c4"],
    ["Go home and cry. Then plan.", "h2 b2 q1"]
  ]}
]},
{ arc: 4, at: [3, 0, "That night"], qs: [
  { lean: "q", tag: "Inner monologue: loud", q: "You can't sleep, and you suddenly realise you can hear everyone's thoughts. Whose do you listen to first?", a: [
    ["Your crush's. Then regret it immediately.", "q2 h1 x1"],
    ["Nobody's. Thoughts should stay private.", "h2 c2"],
    ["The traitor's. Time to learn their secrets.", "b2 s2"],
    ["Everyone's at once. Pure chaos.", "x3 e1"]
  ]},
  { q: "A black notebook falls from the sky at your feet. Any name written in it disappears from the world.", a: [
    ["Burn it right away.", "h3 g1"],
    ["Use it for good. Just on a few people.", "s3 b1 e2"],
    ["Read every rule in it first.", "b3 s1"],
    ["It's a great coaster. You put snacks on it.", "x3 c1"]
  ]}
]},
{ arc: 4, at: [12, 0, "The next day"], qs: [
  { lean: "s", tag: "Yandere flags rising", q: "The villain makes their move. They threaten the person you love most.", a: [
    ["Protect them. Whatever it takes, whatever it costs anyone else.", "s3 h3"],
    ["Stand in front of them and take the hit.", "g3 h2"],
    ["Make the threat vanish quietly. They never find out.", "s2 b2 c1"],
    ["Call in every friend you have.", "h2 e1 d1"]
  ]},
  { q: "The villain finally shows their face. They offer you half the world to join them.", a: [
    ["Refuse, and punch them in the face.", "g4 h1"],
    ["Accept, then take the other half.", "s4 d1 e1"],
    ["Ask about their childhood. You think you can reach them.", "h4"],
    ["Ask to see the contract.", "b3 c1"]
  ]}
]},
{ arc: 4, at: [0, 0, "Midnight"], qs: [
  { q: "Alone in the dark, the villain's voice whispers in your head: \"What scares you most?\"", a: [
    ["Being ordinary.", "d3 e2"],
    ["Losing the people I love.", "h3 g1"],
    ["Being bored for the rest of my life.", "x4"],
    ["Losing control.", "b2 c2"],
    ["Someone seeing who I really am.", "q3 t1"],
    ["Nothing. That's what scares people about me.", "s3 c2"]
  ]}
]},
{ arc: 4, at: [22, 0, "Eve of battle"], qs: [
  { lean: ["t", "q"], tag: "Confession event triggered", q: "You have one chance to tell someone how you really feel.", a: [
    ["Say it! ...Say the opposite of it. Run away.", "t4 x1"],
    ["Say it clearly. No regrets.", "g2 h2"],
    ["Write it in a letter. Leave it where they'll find it.", "q3 h1"],
    ["Wait. There's a perfect moment, and this isn't it.", "b2 c2"]
  ]},
  { q: "What would you give up to win?", a: [
    ["Anything. Anyone.", "s4 d3"],
    ["My body, my sleep, all of it. Never my friends.", "d3 h2 g1"],
    ["Nothing. If it costs that much, it's not worth winning.", "c2 h1 x1"],
    ["Whatever the numbers say is the sensible trade.", "b3 s1"]
  ]}
]},

/* ================= Final arc ================= */
{ arc: 5, at: [18, 0, "Final battle"], qs: [
  { lean: "h", tag: "Power of friendship activated", q: "The final battle. The villain has captured your best friend.", a: [
    ["Charge in. No plan. All heart.", "g3 h2"],
    ["Offer yourself in exchange.", "h3 s1"],
    ["\"Give them back! Not because I care! I just need them!\"", "t3 g1"],
    ["Negotiate. Everyone has a price.", "b2 s2"],
    ["Smile. You'll make the villain regret this, slowly.", "s3 c1"]
  ]},
  { q: "The final battle. The villain takes off their mask. It's someone you used to know.", a: [
    ["Fight anyway. Feelings later.", "g3 d1"],
    ["Try to talk them down.", "h3 c1"],
    ["Laugh. You figured it out weeks ago.", "b2 s2"],
    ["Cry, then fight harder.", "h2 t2 g1"],
    ["For one second, you consider joining them.", "s3 x1"]
  ]}
]},
{ arc: 5, at: [21, 0, "Victory party"], qs: [
  { lean: "b", tag: "Everything is going to plan", q: "You won. Victory party. Someone brings out a board game.", a: [
    ["Win in twenty minutes, every time.", "b3 e1"],
    ["Form a secret alliance, then betray it.", "s2 b2"],
    ["Flip the board. Gently. With love.", "x3 g1"],
    ["Explain the rules to everyone, twice, patiently.", "h2 b2"]
  ]},
  { q: "You won. The victory party is at a karaoke place. Where are you?", a: [
    ["On the mic before anyone has sat down.", "e4 g1"],
    ["Tambourine. Full commitment, zero singing.", "h2 x3"],
    ["In the corner, judging everyone silently.", "c3 s2"],
    ["Ordering food for the whole room.", "h3 d1"],
    ["Whisper-singing one song, then hiding under your jacket.", "q4"]
  ]}
]},
{ arc: 5, at: [23, 30, "Victory party"], qs: [
  { q: "Later at the party, your friends give speeches about you. What do they say?", a: [
    ["\"The loud one who never gave up.\"", "g2 d2 e1"],
    ["\"The kind one we all told our problems to.\"", "h4"],
    ["\"The smart one who's a little bit scary.\"", "b2 s2"],
    ["\"Nobody ever knew what you'd do next.\"", "x4"],
    ["\"The calm one who always knew what to do.\"", "c3 b1"],
    ["\"Acts tough. Cried at every single movie night.\"", "t3 h2"]
  ]}
]},
{ arc: 5, at: [0, 0, "Epilogue"], qs: [
  { flag: "dream", at: [0, 0, "Epilogue"], tag: "Dream callback", q: "The credits roll. On day one, you shouted your dream at the sky. Did you get there?", a: [
    ["Yes. The whole town is screaming my name.", "e3 d2"],
    ["Not yet. Season two.", "d3 g1"],
    ["I found a better dream along the way. My friends.", "h3"],
    ["I took it, by force. Don't ask how.", "s3 d1"]
  ]},
  { lean: "t", tag: "Tsun-to-dere conversion", q: "Post-credits scene. Someone you pushed away all season is waiting for you.", a: [
    ["\"...Took you long enough.\" You finally smile.", "t2 h2"],
    ["Walk past. Then come back. Then walk past again.", "t2 x2"],
    ["Hug them. Deny it ever happened.", "t3 h2"],
    ["Say thank you. Properly, for once.", "h3 c1"]
  ]},
  { q: "The credits roll. Where is your character in the final shot?", a: [
    ["Centre stage, dream achieved, crowd roaring.", "e3 d2"],
    ["At a big table, eating with everyone you love.", "h3 x1"],
    ["Walking away alone into the sunset.", "c3 s1"],
    ["On a throne, looking down at the ruins.", "s4 e2"],
    ["Just behind the hero. It's a great view from there.", "h2 c2"],
    ["Back in the background, exactly where you like it.", "q3 c1"]
  ]}
]}
];

var CHARACTERS = [
  {"name":"Naruto Uzumaki","jp":"うずまきナルト","series":"Naruto","role":"P","type":"nekketsu","g":"M","spot":"#ff9a2e","v":[4,4,0,0,3,5,0,5,1,0],"blurb":"People underestimate you, and you take that personally. You are loud, stubborn and impossible to discourage, and you win people over by refusing to give up on them.","flaw":"Reading the instructions. Also, ramen.","item":"A cup of instant ramen, for emergencies","who":"The title hero of Naruto: a loud, lonely ninja kid in the Hidden Leaf village who wants to become Hokage, the village leader."},
  {"name":"Monkey D. Luffy","jp":"モンキー・D・ルフィ","series":"One Piece","role":"P","type":"baka","g":"M","spot":"#ff6b57","v":[5,3,0,1,5,2,0,4,0,0],"blurb":"You follow your gut, your stomach and your friends, in that order. Plans bore you, and people still follow you anywhere because you never doubt where you are going.","flaw":"Any meal left unguarded near you is gone.","item":"A straw hat that nobody else may touch","who":"Captain of the Straw Hat Pirates in One Piece. His body stretches like rubber and he wants to become King of the Pirates."},
  {"name":"Tanjiro Kamado","jp":"竈門炭治郎","series":"Demon Slayer","role":"P","type":"dere","g":"M","spot":"#4fd1a5","v":[3,5,2,1,0,4,0,1,0,1],"blurb":"You are the kind one who also works harder than everyone else. You feel for people, even those who hurt you, and that kindness is exactly what makes you strong.","flaw":"You are a terrible liar. Your face gives you away.","item":"A wooden box he carries very carefully","who":"The hero of Demon Slayer: a kind boy who becomes a demon hunter after his family is attacked and his sister is turned into a demon."},
  {"name":"Usagi Tsukino","jp":"月野うさぎ","series":"Sailor Moon","role":"P","type":"baka","g":"F","spot":"#ff8fc4","v":[2,5,0,0,4,0,0,2,0,1],"blurb":"You are late, hungry and possibly crying, and you would still give everything for the people you love. Your softness looks like a weakness until it saves the world.","flaw":"Homework. Mornings. Being on time for anything.","item":"A brooch she keeps forgetting is important","who":"The clumsy schoolgirl in Sailor Moon who transforms into Sailor Moon to protect the world, with a team of fellow Sailor Guardians."},
  {"name":"Tohru Honda","jp":"本田透","series":"Fruits Basket","role":"P","type":"dere","g":"F","spot":"#ffc2d6","v":[0,5,2,2,0,2,0,0,0,2],"blurb":"You make people feel safe without trying. You notice who is hurting and quietly look after them, and you are far stronger than your gentle manner suggests.","flaw":"You apologise to furniture when you bump into it.","item":"A handwritten recipe card","who":"The heroine of Fruits Basket: a kind, orphaned high schooler who ends up living with a family cursed to turn into zodiac animals when hugged."},
  {"name":"Spike Spiegel","jp":"スパイク・スピーゲル","series":"Cowboy Bebop","role":"P","type":"daru","g":"M","spot":"#6fa8ff","v":[3,0,0,5,4,0,2,2,0,0],"blurb":"You drift through life with style and no savings. Nothing seems to bother you, trouble always finds you, and you handle it all with a shrug and great taste in music.","flaw":"Your bank balance, and your past.","item":"A lighter that never quite works","who":"A laid-back bounty hunter in the space western Cowboy Bebop, flying around the solar system with a broke crew and a mysterious past."},
  {"name":"Anya Forger","jp":"アーニャ・フォージャー","series":"Spy x Family","role":"P","type":"baka","g":"F","spot":"#ffa3cf","v":[0,4,3,0,5,0,0,2,0,0],"blurb":"You see far more than people think, and you react with the best faces imaginable. You are a tiny agent of chaos with a huge heart, powered by peanuts.","flaw":"Every single school test.","item":"A bag of peanuts and a stuffed toy","who":"The little girl in Spy x Family who can secretly read minds. She's adopted by a spy and an assassin who don't know each other's secrets."},
  {"name":"Yor Forger","jp":"ヨル・フォージャー","series":"Spy x Family","role":"P","type":"dere","g":"F","spot":"#ef6a7a","v":[5,5,0,3,3,0,2,0,0,2],"blurb":"You are sweet, polite and a little awkward, and you could end a fight in one move. Your loved ones get all your warmth. Everyone else should stay on your good side.","flaw":"Cooking. Please stop cooking.","item":"A pair of ornate hairpins. Don't ask.","who":"In Spy x Family, a polite city hall clerk who is secretly a professional assassin, married to a spy as part of a fake family."},
  {"name":"Frieren","jp":"フリーレン","series":"Frieren: Beyond Journey's End","role":"P","type":"kuu","g":"F","spot":"#a3dcc8","v":[0,3,4,5,0,1,0,0,0,1],"blurb":"You take your time with everything, feelings included. You seem calm to the point of sleepy, and people only slowly discover how much you notice and how much you care.","flaw":"Getting out of bed before noon.","item":"A spell book of completely useless spells","who":"An elf mage in Frieren: Beyond Journey's End. Her hero party already saved the world; now she travels again to understand the humans she outlived."},
  {"name":"Edward Elric","jp":"エドワード・エルリック","series":"Fullmetal Alchemist: Brotherhood","role":"P","type":"nekketsu","g":"M","spot":"#ffc94d","v":[4,3,5,0,1,4,0,3,2,0],"blurb":"You are brilliant, hot-headed and very sensitive about at least one thing. You throw yourself at impossible problems because the people you love are worth it.","flaw":"Anyone mentioning your height. And milk.","item":"A silver pocket watch","who":"The young alchemist hero of Fullmetal Alchemist: Brotherhood, searching with his brother for a way to undo a forbidden experiment."},
  {"name":"Shoyo Hinata","jp":"日向翔陽","series":"Haikyu!!","role":"P","type":"genki","g":"M","spot":"#ffb03a","v":[4,3,0,0,1,5,0,3,0,0],"blurb":"You are pure energy pointed at one goal. You are not the biggest or the most experienced, so you jump higher and practise longer until the whole team believes too.","flaw":"Your stomach, right before every big match.","item":"A slightly deflated volleyball","who":"The short but explosive volleyball player at the heart of Haikyu!!, determined to prove that height isn't everything."},
  {"name":"Haruhi Fujioka","jp":"藤岡ハルヒ","series":"Ouran High School Host Club","role":"P","type":"kuu","g":"F","spot":"#c9b1ff","v":[1,3,4,4,0,3,0,0,1,0],"blurb":"You are unimpressed by money, drama and fancy people. You study hard, say what you think and stay completely yourself, which makes you more interesting than everyone around you.","flaw":"Thunderstorms, and one very expensive vase.","item":"A supermarket discount flyer","who":"A scholarship student at an elite school in Ouran High School Host Club, mistaken for a boy and roped into a club of rich, dramatic hosts."},
  {"name":"Goku","jp":"孫悟空","series":"Dragon Ball","role":"P","type":"nekketsu","g":"M","spot":"#ff9e45","v":[5,3,0,2,3,5,0,2,0,0],"blurb":"You want one thing, which is a stronger opponent. You are cheerful, simple and wildly dedicated, and you will happily miss an important event to go and train.","flaw":"Family admin of any kind.","item":"A bag of magic beans","who":"The cheerful martial artist hero of Dragon Ball, an alien warrior raised on Earth who lives for fighting stronger opponents."},
  {"name":"Eren Yeager","jp":"エレン・イェーガー","series":"Attack on Titan","role":"P","type":"nekketsu","g":"M","spot":"#7fae6c","v":[5,1,1,0,1,5,4,3,1,0],"blurb":"You have a burning need to be free, and you are going to get it. You are intense, angry at the way the world works, and very hard to stop once you have decided.","flaw":"You cannot let a single thing go.","item":"A key on a cord around his neck","who":"The hot-headed hero of Attack on Titan, living inside giant walls that protect humanity from man-eating Titans."},
  {"name":"Izuku Midoriya","jp":"緑谷出久","series":"My Hero Academia","role":"P","type":"dan","g":"M","spot":"#59c98f","v":[3,5,4,0,0,5,0,1,0,3],"blurb":"You fill notebooks, you cry often, and you always run towards the danger. You study your heroes closely, and one day other people will be studying you.","flaw":"You mutter your entire thought process out loud.","item":"Hero analysis notebook No. 13","who":"Nicknamed Deku, the hero of My Hero Academia: a powerless boy who inherits the power of the world's greatest hero."},
  {"name":"Ichigo Kurosaki","jp":"黒崎一護","series":"Bleach","role":"P","type":"tsun","g":"M","spot":"#ff8a3d","v":[5,4,1,2,0,3,1,2,3,0],"blurb":"You scowl at everything and protect everyone. You did not ask for any of this, but you will fight anything that threatens your people and act annoyed the whole time.","flaw":"People assuming you're a delinquent because of your hair.","item":"A giant sword wrapped in cloth","who":"The orange-haired hero of Bleach: a teenager who can see ghosts and gains the powers of a Soul Reaper."},
  {"name":"Yuji Itadori","jp":"虎杖悠仁","series":"Jujutsu Kaisen","role":"P","type":"dere","g":"M","spot":"#ff7f8f","v":[4,5,1,1,2,2,0,1,0,0],"blurb":"You are a friendly, athletic kid who simply wants people to have a decent ending. You carry heavy things with a smile and you throw a very strong punch.","flaw":"Eating things you really should not eat.","item":"A stack of films he's been told to watch","who":"The lead of Jujutsu Kaisen, a strong, friendly student who ends up sharing his body with an ancient cursed king."},
  {"name":"Denji","jp":"デンジ","series":"Chainsaw Man","role":"P","type":"baka","g":"M","spot":"#ff5a4f","v":[3,2,0,0,5,2,2,2,0,0],"blurb":"Your dreams are small and your methods are unhinged. You want good food, a warm bed and a little affection, and you will fight anything to keep them.","flaw":"Anyone who is even slightly nice to you.","item":"A jar of jam he's very proud of","who":"The broke, simple-hearted hero of Chainsaw Man, who can turn parts of his body into chainsaws and hunts devils for the government."},
  {"name":"Gon Freecss","jp":"ゴン・フリークス","series":"Hunter x Hunter","role":"P","type":"genki","g":"M","spot":"#7ed957","v":[5,4,0,0,2,4,1,2,0,0],"blurb":"You are bright, honest and friends with every animal. You also have a stubborn streak that scares people, because once you decide something, you never count the cost.","flaw":"You take everything far too personally.","item":"A fishing rod he made himself","who":"The bright, wild boy at the centre of Hunter x Hunter, who sets out to become a Hunter and find the father who left him."},
  {"name":"Saitama","jp":"サイタマ","series":"One-Punch Man","role":"P","type":"daru","g":"M","spot":"#ffd84d","v":[2,2,0,5,3,0,0,0,0,0],"blurb":"You are extremely capable and mostly thinking about supermarket discounts. Big dramatic moments do not impress you, and you finish the job before anyone notices.","flaw":"Nobody ever remembers your name.","item":"A supermarket bag with a discount sticker","who":"The hero of One-Punch Man: so strong he beats every enemy with one punch, and bored out of his mind because of it."},
  {"name":"Loid Forger","jp":"ロイド・フォージャー","series":"Spy x Family","role":"P","type":"strat","g":"M","spot":"#6dc2b0","v":[2,3,5,4,0,3,2,0,0,1],"blurb":"You have a plan, a backup plan, and a backup disguise. You are the competent adult holding everything together, and you are far more tired than anyone knows.","flaw":"Your own overthinking, at 3 a.m.","item":"A disguise kit hidden in a briefcase","who":"Codename Twilight, the master spy in Spy x Family who builds a fake family for a mission without knowing who they really are."},
  {"name":"Violet Evergarden","jp":"ヴァイオレット・エヴァーガーデン","series":"Violet Evergarden","role":"P","type":"kuu","g":"F","spot":"#9fc1ff","v":[2,4,2,5,0,2,1,0,0,1],"blurb":"You are formal, precise and still learning what your own feelings mean. You put more care into a single letter than most people put into a whole year.","flaw":"Understanding jokes. And sarcasm.","item":"A typewriter and a green brooch","who":"A former child soldier in Violet Evergarden who becomes a letter writer, learning what emotions mean one letter at a time."},
  {"name":"Shinji Ikari","jp":"碇シンジ","series":"Neon Genesis Evangelion","role":"P","type":"dan","g":"M","spot":"#b6a6f5","v":[0,3,2,1,0,0,1,0,0,4],"blurb":"You would really prefer not to be involved. You feel everything very deeply, you need a lot of quiet time, and you keep showing up anyway, which counts as bravery.","flaw":"Your dad. Also, any conversation with your dad.","item":"A cassette player with the same two songs","who":"The reluctant teenage pilot of a giant robot in Neon Genesis Evangelion, sent by his distant father to fight mysterious Angels."},
  {"name":"Thorfinn","jp":"トルフィン","series":"Vinland Saga","role":"P","type":"lone","g":"M","spot":"#c7b17f","v":[4,2,1,3,0,3,3,0,1,1],"blurb":"You have been through a lot, and it shaped you. You are quiet and capable, and your real strength is your choice to be a better person than your anger wants you to be.","flaw":"Your past keeps turning up uninvited.","item":"A pair of daggers he no longer uses","who":"The lead of Vinland Saga, a young warrior raised in Viking wars who slowly searches for a life without violence."},
  {"name":"Senku Ishigami","jp":"石神千空","series":"Dr. Stone","role":"P","type":"strat","g":"M","spot":"#a6e36b","v":[1,2,5,2,3,5,0,4,1,0],"blurb":"You would rebuild civilisation from nothing and enjoy it. You grin at impossible problems, trust only what you can prove, and count everything to several decimal places.","flaw":"Physical labour of any description.","item":"A home-made glass flask","who":"The genius teen in Dr. Stone who wakes up thousands of years after all humans were turned to stone, and rebuilds science from scratch."},
  {"name":"Asta","jp":"アスタ","series":"Black Clover","role":"P","type":"nekketsu","g":"M","spot":"#8fd16f","v":[5,3,0,0,2,5,0,5,0,0],"blurb":"You have no natural talent and an unlimited supply of volume. You shout your goal at the sky every day, and your sheer effort has started to frighten the talented people.","flaw":"Indoor voice. You do not have one.","item":"A rusty sword that eats magic","who":"The hero of Black Clover: the only boy in a world of magic born with none, who wants to become the Wizard King anyway."},
  {"name":"Shigeo Kageyama","jp":"影山茂夫","series":"Mob Psycho 100","role":"P","type":"dan","g":"M","spot":"#c5a3f0","v":[1,4,1,4,1,2,0,0,0,4],"blurb":"You look like nobody special, and you are holding back something enormous. You stay gentle on purpose, and you would rather be a good person than a powerful one.","flaw":"Talking to anyone you have a crush on.","item":"A body-improvement club badge","who":"Nicknamed Mob, the quiet boy in Mob Psycho 100 with enormous psychic power, who mostly just wants to be a normal kid."},
  {"name":"Kaguya Shinomiya","jp":"四宮かぐや","series":"Kaguya-sama: Love Is War","role":"P","type":"tsun","g":"F","spot":"#ff7a8a","v":[1,2,5,3,2,4,2,4,4,0],"blurb":"You treat your feelings like a war you must win. You are brilliant, elegant and willing to build a full strategy to avoid saying one honest sentence.","flaw":"Admitting you like someone first.","item":"A schedule planned to the minute","who":"The brilliant vice-president of the student council in Kaguya-sama: Love Is War, locked in a battle to make her crush confess first."},
  {"name":"Marin Kitagawa","jp":"喜多川海夢","series":"My Dress-Up Darling","role":"P","type":"genki","g":"F","spot":"#ff84b5","v":[3,5,0,0,4,4,0,3,0,0],"blurb":"You love what you love at full volume, and you make everyone feel welcome to love their thing too. You have no shame, huge energy and a very long watchlist.","flaw":"Sewing. You have tried. Your fingers remember.","item":"A wig she styled at 3 a.m.","who":"The bubbly, fashionable girl in My Dress-Up Darling who loves cosplay and teams up with a quiet classmate who can sew."},
  {"name":"Sakura Kinomoto","jp":"木之本桜","series":"Cardcaptor Sakura","role":"P","type":"genki","g":"F","spot":"#ffb0cf","v":[3,5,1,1,2,2,0,1,0,1],"blurb":"You are cheerful, sporty and braver than you think. You face scary things while saying you will be fine, and somehow you always are.","flaw":"Ghosts. Absolutely not.","item":"A star-shaped staff and roller skates","who":"A cheerful ten-year-old in Cardcaptor Sakura who accidentally releases a set of magical cards and must capture them all."},
  {"name":"Lelouch Lamperouge","jp":"ルルーシュ・ランペルージ","series":"Code Geass","role":"P","type":"chuuni","g":"M","spot":"#b98cff","v":[3,2,5,3,1,5,4,5,2,0],"blurb":"You are a dramatic genius with a cape-sized sense of occasion. You play the whole world like chess, and everything you do is for someone you love.","flaw":"Stairs, running, and any form of exercise.","item":"A black chess king","who":"The exiled prince in Code Geass who gains the power to command anyone, and becomes a masked rebel leader."},
  {"name":"Taiga Aisaka","jp":"逢坂大河","series":"Toradora!","role":"P","type":"tsun","g":"F","spot":"#ffb35c","v":[5,3,1,0,4,2,1,3,5,1],"blurb":"You are small, fierce and ready to fight anyone who looks at you wrong. You hide a very soft heart behind a very loud growl, and the people who get past it are yours for life.","flaw":"Clumsiness. And every piece of furniture you've ever kicked.","item":"A wooden practice sword","who":"The tiny, fierce heroine of Toradora!, nicknamed the Palmtop Tiger, who teams up with a classmate to help each other's crushes."},
  {"name":"Chitoge Kirisaki","jp":"桐崎千棘","series":"Nisekoi","role":"P","type":"tsun","g":"F","spot":"#ffcc4d","v":[4,4,1,1,3,2,0,3,4,0],"blurb":"You are sporty, loud and terrible at hiding your feelings. You start every relationship with a shove and end it as someone's fiercest protector.","flaw":"Any comment about your gorilla strength.","item":"A big red ribbon","who":"A gang boss's daughter in Nisekoi who has to fake-date the heir of a rival gang to keep the peace."},
  {"name":"Mikoto Misaka","jp":"御坂美琴","series":"A Certain Scientific Railgun","role":"P","type":"tsun","g":"F","spot":"#6fb7ff","v":[4,4,3,2,2,4,0,3,4,0],"blurb":"You're an ace with real power and a strong sense of justice. You kick vending machines, you protect your friends, and you get flustered the second anyone is nice to you.","flaw":"A certain spiky-haired idiot who keeps ignoring you.","item":"An arcade coin, for emergencies","who":"An electric-powered ace student in A Certain Scientific Railgun, nicknamed Railgun, who fights crime in a city of espers."},
  {"name":"Shoko Komi","jp":"古見硝子","series":"Komi Can't Communicate","role":"P","type":"dan","g":"F","spot":"#8a7be6","v":[1,4,3,4,0,3,0,1,0,5],"blurb":"Everyone thinks you're cool and perfect. In truth, you're desperately trying to say hello. You write wonderful notes, and your goal is a hundred friends.","flaw":"Speaking. Out loud. To anyone.","item":"A notebook for everything she can't say","who":"The most admired girl at school in Komi Can't Communicate, who has severe social anxiety and wants a hundred friends."},
  {"name":"Hitori Gotoh","jp":"後藤ひとり","series":"Bocchi the Rock!","role":"P","type":"dan","g":"F","spot":"#ff9ccf","v":[0,3,3,0,4,3,0,0,0,5],"blurb":"You are a guitar genius who can't order a coffee. You fall apart in social situations, but put a guitar in your hands and you play like the world depends on it.","flaw":"Literally every social interaction.","item":"A pink tracksuit and a guitar","who":"Nicknamed Bocchi, an extremely shy guitar prodigy in Bocchi the Rock! who finally joins a real band."},
  {"name":"Sawako Kuronuma","jp":"黒沼爽子","series":"Kimi ni Todoke","role":"P","type":"dan","g":"F","spot":"#6c6cb0","v":[1,5,2,1,0,3,0,0,0,5],"blurb":"People think you're spooky. You're actually the kindest person in your class, quietly doing the jobs nobody else wants and hoping someone will say good morning.","flaw":"Your smile scares people. You're working on it.","item":"A notebook of everyone's good qualities","who":"A kind girl in Kimi ni Todoke whom classmates think is creepy, until a popular boy starts talking to her."},
  {"name":"Haruhi Suzumiya","jp":"涼宮ハルヒ","series":"The Melancholy of Haruhi Suzumiya","role":"P","type":"kami","g":"F","spot":"#ffc24d","v":[4,2,3,1,5,5,1,5,2,0],"blurb":"You are bored by normal life and you will fix that by force. You start clubs, drag people along and make the impossible happen, whether or not you realise it.","flaw":"When you're bored, reality starts to wobble.","item":"An armband that says Brigade Chief","who":"The bored, bossy title character of The Melancholy of Haruhi Suzumiya, who starts a club to find aliens and time travellers."},
  {"name":"Hayase Nagatoro","jp":"長瀞早瀬","series":"Don't Toy with Me, Miss Nagatoro","role":"P","type":"sado","g":"F","spot":"#d08a5c","v":[3,3,2,2,4,2,1,3,2,0],"blurb":"You tease people because you like them, and you're very good at it. Under the smug grin is someone who just wants their favourite person to stand up for themselves.","flaw":"Being teased back. Instant meltdown.","item":"A sketchbook she borrowed without asking","who":"A teasing underclassman in Don't Toy with Me, Miss Nagatoro who can't stop messing with a shy art-club senior."},
  {"name":"Takagi","jp":"高木さん","series":"Teasing Master Takagi-san","role":"P","type":"sado","g":"F","spot":"#9b7be0","v":[1,4,4,4,2,2,1,1,1,0],"blurb":"You are gentle, clever and always one step ahead in the game of who blushes first. You never lose, and your teasing is really a very slow, very patient love letter.","flaw":"None. You're just that good at this.","item":"An eraser with a name written on it","who":"The girl in Teasing Master Takagi-san who always wins her teasing battles against the boy who sits next to her."},
  {"name":"Gintoki Sakata","jp":"坂田銀時","series":"Gintama","role":"P","type":"daru","g":"M","spot":"#b8c4dc","v":[4,3,2,4,4,0,1,2,1,0],"blurb":"You're lazy, broke and powered by sugar and comics. You complain about everything and do nothing, until someone needs help. Then you're unstoppable.","flaw":"Rent. It's always due.","item":"A wooden sword and a carton of strawberry milk","who":"A lazy, sweets-loving samurai who runs an odd-jobs business in the comedy Gintama."},
  {"name":"Houtarou Oreki","jp":"折木奉太郎","series":"Hyouka","role":"P","type":"daru","g":"M","spot":"#6f9a82","v":[0,2,5,4,0,0,0,0,1,1],"blurb":"Your motto is to do nothing you don't have to, and to do what you must quickly. You're secretly a brilliant detective. You just wish people would stop being curious.","flaw":"A girl who says she's curious and won't let it go.","item":"A paperback he'll never finish","who":"An energy-saving student in Hyouka who gets pulled into solving small school mysteries."},
  {"name":"Rikka Takanashi","jp":"小鳥遊六花","series":"Love, Chunibyo & Other Delusions","role":"P","type":"chuuni","g":"F","spot":"#8a6bff","v":[1,3,1,0,5,2,0,3,0,2],"blurb":"You have a wicked eye, a secret organisation and a very cool umbrella. The delusions are a shield, and inside it is a sweet, kind person who misses someone a lot.","flaw":"Tomatoes. And the real world.","item":"An eye patch and an umbrella","who":"A girl in Love, Chunibyo & Other Delusions who wears an eye patch and believes she has a magical Wicked Eye."},
  {"name":"Rintaro Okabe","jp":"岡部倫太郎","series":"Steins;Gate","role":"P","type":"chuuni","g":"M","spot":"#8a8aa8","v":[2,3,4,1,5,3,1,4,0,0],"blurb":"You are a self-proclaimed mad scientist with a fake phone-call habit and a real genius streak. Under the cackle, you'd bend time itself for your friends.","flaw":"The Organisation. It's probably watching you right now.","item":"A lab coat and a phone with no one on the line","who":"A self-proclaimed mad scientist in Steins;Gate whose tiny lab accidentally discovers a way to message the past."},
  {"name":"Maomao","jp":"猫猫","series":"The Apothecary Diaries","role":"P","type":"strat","g":"F","spot":"#7fb06e","v":[2,2,5,4,2,3,1,0,1,1],"blurb":"You are a palace servant with no interest in romance and endless interest in poisons. You solve mysteries because they're there, and you'd like everyone to stop looking at you.","flaw":"Testing poisons on yourself. Please stop.","item":"A pouch of herbs. Some are deadly.","who":"A sharp young apothecary in The Apothecary Diaries who solves poison mysteries inside the imperial palace."},
  {"name":"Ai Hoshino","jp":"星野アイ","series":"Oshi no Ko","role":"P","type":"doro","g":"F","spot":"#ff7fb5","v":[2,4,3,4,1,4,2,5,0,0],"blurb":"You are the idol everyone loves, with stars in your eyes and a smile you've practised a thousand times. You call your lies a kind of love, and you hope one day they'll come true.","flaw":"Saying I love you and knowing if you mean it.","item":"A glow stick in your colour","who":"A dazzling idol in Oshi no Ko whose story sets off the whole series."},
  {"name":"Kirito","jp":"キリト","series":"Sword Art Online","role":"P","type":"lone","g":"M","spot":"#5a6f9a","v":[4,3,3,4,0,4,1,2,1,2],"blurb":"You're a solo player by choice. You'd rather clear the dungeon alone than risk anyone else, which means people keep following you anyway.","flaw":"Your wardrobe: black, black and more black.","item":"Two swords and a black coat","who":"The solo-playing hero of Sword Art Online, trapped in a virtual reality game where defeat is real."},
  {"name":"Umaru Doma","jp":"土間うまる","series":"Himouto! Umaru-chan","role":"P","type":"daru","g":"F","spot":"#ff9b4a","v":[1,3,3,1,5,0,0,3,1,1],"blurb":"In public you're perfect. At home you're a crisp-eating, game-playing gremlin in a hamster hoodie. Both are completely you.","flaw":"Leaving the sofa.","item":"A hamster hoodie and a game controller","who":"The title character of Himouto! Umaru-chan: a model student in public who turns into a lazy gamer at home."},
  {"name":"Miyuki Shirogane","jp":"白銀御行","series":"Kaguya-sama: Love Is War","role":"P","type":"tsun","g":"M","spot":"#e6c14a","v":[2,3,5,2,1,5,1,3,4,1],"blurb":"You're the hardworking student council president who refuses to confess first. You study through the night, overthink everything, and secretly practise everything you're bad at.","flaw":"Singing. Volleyball. Any skill you haven't practised in secret.","item":"Bags under your eyes and a stack of study guides","who":"The student council president in Kaguya-sama: Love Is War, a poor, hard-working genius locked in a love war with Kaguya."},
  {"name":"Yumeko Jabami","jp":"蛇喰夢子","series":"Kakegurui","role":"P","type":"doro","g":"F","spot":"#d01e3c","v":[3,2,5,3,5,2,3,3,0,0],"blurb":"You're polite, sweet and a total risk addict. The higher the stakes, the brighter your eyes shine, and you'd bet everything just to feel alive.","flaw":"Saying no to a gamble. Any gamble.","item":"A deck of cards and a red-eyed grin","who":"The transfer student in Kakegurui who arrives at a school ruled by gambling and loves the risk more than the winning."},
  {"name":"Subaru Natsuki","jp":"ナツキ・スバル","series":"Re:Zero","role":"P","type":"dere","g":"M","spot":"#f2a43a","v":[3,5,2,0,4,4,1,3,0,0],"blurb":"You're loud, awkward and stubborn, and you refuse to give up on the people you care about, no matter how many times things go wrong. Seriously. No matter how many.","flaw":"Your tracksuit. It's the only outfit you own.","item":"A tracksuit and a convenience-store bag","who":"The hero of Re:Zero, a shut-in suddenly transported to a fantasy world, who discovers he keeps coming back after death."},
  {"name":"Jotaro Kujo","jp":"空条承太郎","series":"JoJo's Bizarre Adventure","role":"P","type":"kuu","g":"M","spot":"#4f5fb0","v":[5,3,4,5,0,3,1,2,2,0],"blurb":"You're tall, unshakable and allergic to unnecessary words. Your coolness is legendary, and under the hat you'd do anything for your family.","flaw":"The phrase 'good grief'. You say it constantly.","item":"A long school coat and a cap that's part of your hair","who":"The hero of JoJo's Bizarre Adventure part 3, a stoic delinquent with a powerful spirit called a Stand."},
  {"name":"Hachiman Hikigaya","jp":"比企谷八幡","series":"My Teen Romantic Comedy SNAFU","role":"P","type":"lone","g":"M","spot":"#6a7f6a","v":[1,3,4,4,1,1,2,0,3,3],"blurb":"You're a cynical loner with sharp observations and dead-fish eyes. You solve people's problems by taking the hit yourself, and you'd never call it kindness.","flaw":"Assuming every nice thing is a trap.","item":"A can of very sweet coffee","who":"The cynical hero of My Teen Romantic Comedy SNAFU, forced into a school club that solves other students' problems."},
  {"name":"Light Yagami","jp":"夜神月","series":"Death Note","role":"V","type":"kami","g":"M","spot":"#d9534f","v":[1,0,5,3,0,5,5,5,1,0],"blurb":"You are top of the class and you have already planned your next twelve moves. You want to win, you want things done your way, and a little god complex might be involved.","flaw":"Being outsmarted, even once.","item":"A black notebook. Don't touch it.","who":"A top student in Death Note who finds a notebook that kills anyone whose name is written in it, and decides to reshape the world."},
  {"name":"Itachi Uchiha","jp":"うちはイタチ","series":"Naruto","role":"V","type":"lone","g":"M","spot":"#c9444f","v":[2,3,5,5,0,2,4,0,0,2],"blurb":"You are calm, tired and carrying more than anyone knows. You say very little, you always see the bigger picture, and the people who think they understand you do not.","flaw":"You never just explain yourself.","item":"A single stick of dango","who":"A legendary, mysterious ninja in Naruto, and the older brother of Sasuke, with a reputation that hides a lot."},
  {"name":"Madara Uchiha","jp":"うちはマダラ","series":"Naruto","role":"V","type":"kami","g":"M","spot":"#b5474f","v":[4,0,4,4,0,5,5,5,1,0],"blurb":"You do not enter a room, you arrive in it. You have a grand vision for the world and no interest in anyone's opinion of it, and you say so while looking magnificent.","flaw":"Hair maintenance takes up most of your day.","item":"A war fan the size of a door","who":"A legendary ninja warlord from Naruto's past whose plans shape the whole story."},
  {"name":"Orochimaru","jp":"大蛇丸","series":"Naruto","role":"V","type":"doro","g":"M","spot":"#9bbf7a","v":[1,0,5,3,2,4,5,2,0,0],"blurb":"You are endlessly curious and have no ethical limits. You want to learn everything that exists, and you are willing to wait a very long time, in a very creepy way.","flaw":"HR has opened several files about you.","item":"A shelf of jars you shouldn't look in","who":"A snake-like rogue ninja in Naruto, obsessed with forbidden science and living forever."},
  {"name":"Ryomen Sukuna","jp":"両面宿儺","series":"Jujutsu Kaisen","role":"V","type":"kami","g":"M","spot":"#e8505b","v":[5,0,3,3,4,1,5,5,2,0],"blurb":"You do exactly what you enjoy, and you enjoy being the strongest. Other people's rules are funny to you. You treat the entire world as a place for your amusement.","flaw":"Being stuck sharing a space with a nice boy.","item":"A cursed finger. One of twenty.","who":"The King of Curses in Jujutsu Kaisen, an ancient, gleefully cruel spirit sealed inside the hero's body."},
  {"name":"Sosuke Aizen","jp":"藍染惣右介","series":"Bleach","role":"V","type":"kami","g":"M","spot":"#a19ce0","v":[1,0,5,5,1,3,5,5,0,0],"blurb":"You are polite, patient and ten years ahead of everyone. By the time people notice what is happening, you have already won, and you would like them to know it.","flaw":"You really need people to admire the plan.","item":"A pair of glasses he doesn't need","who":"A gentle-seeming captain of the Soul Society in Bleach, with far more going on behind his glasses."},
  {"name":"Frieza","jp":"フリーザ","series":"Dragon Ball","role":"V","type":"hime","g":"M","spot":"#d9a6ff","v":[2,0,3,3,1,2,5,5,2,0],"blurb":"You have impeccable manners and an intergalactic real estate empire. You expect to be obeyed, you speak softly, and you take losing as a personal insult.","flaw":"Monkeys, specifically.","item":"A floating hover-pod","who":"A galactic emperor in Dragon Ball who conquers planets to sell them, with perfect manners and a terrifying temper."},
  {"name":"Dio Brando","jp":"ディオ・ブランドー","series":"JoJo's Bizarre Adventure","role":"V","type":"chuuni","g":"M","spot":"#ffd447","v":[5,0,2,2,4,4,5,5,2,0],"blurb":"You are the most dramatic person in every building. You pose, you shout, and you insist on winning at everything, including things nobody else was competing in.","flaw":"You cannot resist a theatrical entrance.","item":"A stone mask","who":"The flamboyant arch-villain of JoJo's Bizarre Adventure, famous for his poses, his ego and his catchphrases."},
  {"name":"Muzan Kibutsuji","jp":"鬼舞辻無惨","series":"Demon Slayer","role":"V","type":"hime","g":"M","spot":"#d74b6c","v":[1,0,3,3,0,5,5,3,3,0],"blurb":"You are a terrible boss who wants to live forever. You are refined, paranoid and easily annoyed, and your staff meetings are the most stressful in all of fiction.","flaw":"The sun. Also, being called pale.","item":"A fedora and a very nice suit","who":"The first demon and the main villain of Demon Slayer, hiding in human society as an elegant gentleman."},
  {"name":"Akaza","jp":"猗窩座","series":"Demon Slayer","role":"V","type":"nekketsu","g":"M","spot":"#ff7fbf","v":[5,1,1,1,1,5,4,2,1,0],"blurb":"You only respect strength, and you keep inviting strong people to join you. You train forever, you fight fair, and there is an old sadness underneath that you refuse to look at.","flaw":"You won't stop asking the strong ones to be friends.","item":"A pair of fists. That's it.","who":"A martial-arts-obsessed demon in Demon Slayer, one of the Twelve Kizuki, who respects only strength."},
  {"name":"Hisoka Morow","jp":"ヒソカ","series":"Hunter x Hunter","role":"V","type":"sado","g":"M","spot":"#ff77c8","v":[3,0,3,4,5,1,5,3,0,0],"blurb":"You are a playful menace with a deck of cards. Everyone in the room is uncomfortable and you love it. You are only here for the strongest opponents and your own entertainment.","flaw":"You get bored of everything eventually.","item":"A deck of playing cards","who":"A creepy, playful magician-fighter in Hunter x Hunter who hunts strong opponents for fun."},
  {"name":"Meruem","jp":"メルエム","series":"Hunter x Hunter","role":"V","type":"kami","g":"M","spot":"#7ad0c0","v":[4,2,5,4,0,3,4,4,2,0],"blurb":"You arrived sure of your superiority, then a board game changed your mind about things. You are terrifyingly smart, and the most dangerous thing about you is that you can grow.","flaw":"Losing at board games. Repeatedly.","item":"A Gungi board","who":"The king of the Chimera Ants in Hunter x Hunter, born to rule, who is changed by a girl who beats him at board games."},
  {"name":"Griffith","jp":"グリフィス","series":"Berserk","role":"V","type":"kami","g":"M","spot":"#e8ecf8","v":[3,1,4,5,0,5,5,4,0,0],"blurb":"You are beautiful, adored and completely focused on your dream. People would follow you anywhere. The only question is what you will give up to get there.","flaw":"Your dream comes before everybody. Everybody.","item":"A red egg-shaped pendant","who":"The charismatic leader of the Band of the Hawk in Berserk, chasing a dream of having his own kingdom."},
  {"name":"Johan Liebert","jp":"ヨハン・リーベルト","series":"Monster","role":"V","type":"doro","g":"M","spot":"#bfc8dc","v":[0,0,5,5,1,1,5,0,0,0],"blurb":"You are soft-spoken, charming and the scariest person in any story you enter. You never raise your voice, you never need to, and people tell you all their secrets.","flaw":"None that anybody has lived to report.","item":"A picture book with no title","who":"The polite, beautiful and deeply disturbing figure at the centre of the thriller Monster."},
  {"name":"Shogo Makishima","jp":"槙島聖護","series":"Psycho-Pass","role":"V","type":"strat","g":"M","spot":"#d7dde8","v":[1,0,5,5,1,1,4,1,0,1],"blurb":"You quote books mid-crisis and you want people to think for themselves, by any means necessary. You are calm, well read and not nearly as harmless as you look.","flaw":"You can't get through a conversation without a citation.","item":"A worn, heavily annotated paperback","who":"A calm, book-quoting antagonist in Psycho-Pass who challenges a society run by a mind-reading system."},
  {"name":"Donquixote Doflamingo","jp":"ドンキホーテ・ドフラミンゴ","series":"One Piece","role":"V","type":"sado","g":"M","spot":"#ff6fa8","v":[4,0,3,2,5,3,5,5,1,0],"blurb":"You wear a pink feather coat and run a criminal empire with a grin. You find other people's suffering hilarious, and your laugh can be heard from several islands away.","flaw":"That coat needs dry cleaning weekly.","item":"A pink feather coat","who":"A pink-coated pirate warlord and crime boss in One Piece who rules a kingdom with a grin."},
  {"name":"Tomura Shigaraki","jp":"死柄木弔","series":"My Hero Academia","role":"V","type":"lone","g":"M","spot":"#a3b9d6","v":[3,0,2,1,4,3,5,2,2,2],"blurb":"You hate how the whole game is set up, and you would like to delete it. You treat the world like a video game, you are always scratching at something, and you are not okay.","flaw":"Moisturiser. Please try moisturiser.","item":"A game controller with worn-out buttons","who":"Leader of the League of Villains in My Hero Academia, who destroys anything he touches and hates hero society."},
  {"name":"Himiko Toga","jp":"トガヒミコ","series":"My Hero Academia","role":"V","type":"yan","g":"F","spot":"#ffa7b5","v":[3,3,0,0,5,2,5,1,0,0],"blurb":"You are a bubbly schoolgirl with a very alarming hobby. You love intensely, you smile constantly, and nobody can decide whether to run away or be your friend.","flaw":"Personal boundaries. Everyone else's.","item":"A cute bag with something sharp inside","who":"A bubbly villain in My Hero Academia who can transform into people, and has a very unsettling idea of love."},
  {"name":"Makima","jp":"マキマ","series":"Chainsaw Man","role":"V","type":"doro","g":"F","spot":"#f27d6b","v":[1,1,5,5,0,4,5,1,0,0],"blurb":"You are calm, kind and absolutely in charge. You always smile, and everyone around you is doing what you wanted without quite knowing how that happened.","flaw":"You only like the dogs that obey.","item":"A leash. For dogs, she says.","who":"The calm, mysterious boss of the Public Safety devil hunters in Chainsaw Man, who always seems to get her way."},
  {"name":"Esdeath","jp":"エスデス","series":"Akame ga Kill!","role":"V","type":"sado","g":"F","spot":"#8fd8ff","v":[5,1,2,4,2,3,5,4,0,0],"blurb":"You are an unbeatable general with very simple beliefs: the strong win, the weak do not. You also have a surprisingly earnest romantic side, which worries everyone.","flaw":"Your idea of a first date.","item":"A list of requirements for her ideal partner","who":"An undefeated ice-wielding general in Akame ga Kill! who loves battle and is surprisingly serious about romance."},
  {"name":"Mahito","jp":"真人","series":"Jujutsu Kaisen","role":"V","type":"sado","g":"M","spot":"#9fd4d0","v":[2,0,2,2,5,2,5,2,0,0],"blurb":"You are endlessly curious, like a child taking apart toys, except the toys are people. You find everything interesting and you cannot be made to feel bad about any of it.","flaw":"You keep asking what a soul is. It's a lot.","item":"Stitches. Everywhere.","who":"A cursed spirit in Jujutsu Kaisen who can reshape human souls, and treats it all like a curious game."},
  {"name":"Yuno Gasai","jp":"我妻由乃","series":"Future Diary","role":"V","type":"yan","g":"F","spot":"#ff6e9a","v":[5,5,3,1,4,5,5,1,0,0],"blurb":"You are sweet, devoted and frighteningly competent. You have decided who your person is, and you will protect them from everything, including other people and logic.","flaw":"Other people talking to your person.","item":"A phone diary that logs one person's every move","who":"A sweet-seeming girl in Future Diary who is dangerously obsessed with the boy she loves, during a deadly survival game."},
  {"name":"Satou Matsuzaka","jp":"松坂さとう","series":"Happy Sugar Life","role":"V","type":"yan","g":"F","spot":"#ffb6d0","v":[3,4,4,4,1,4,5,1,0,0],"blurb":"Your smile is sugar and your love is total. You've found the one thing that makes life sweet, and you'll lock every door to keep it.","flaw":"Sharing. Anything. Ever.","item":"A key on a pink ribbon","who":"A cheerful high school girl in Happy Sugar Life who will do anything to protect the one thing that makes her happy."},
  {"name":"Kurumi Tokisaki","jp":"時崎狂三","series":"Date A Live","role":"V","type":"yan","g":"F","spot":"#e0294f","v":[3,2,4,3,4,3,5,4,0,0],"blurb":"You are elegant, theatrical and always one step ahead in time. You flirt like it's a game you invented, and you fully intend to win.","flaw":"The clock in your eye, counting everyone's time.","item":"An antique flintlock pistol","who":"A gothic, time-manipulating Spirit in Date A Live, elegant, flirtatious and very dangerous."},
  {"name":"L","jp":"エル","series":"Death Note","role":"S","type":"strat","g":"M","spot":"#b9c0d4","v":[0,1,5,3,4,1,1,1,0,1],"blurb":"You think best while sitting strangely and eating something sweet. You run on curiosity, odd habits and very little sleep, and you are usually right, which annoys everyone.","flaw":"Shoes. Sleep. Vegetables.","item":"A tower of sugar cubes","who":"The eccentric genius detective in Death Note who sits strangely, eats sweets nonstop and hunts the killer Kira."},
  {"name":"Levi Ackerman","jp":"リヴァイ・アッカーマン","series":"Attack on Titan","role":"S","type":"lone","g":"M","spot":"#8fb3c9","v":[3,2,2,5,0,4,2,1,3,0],"blurb":"You say very little, you do everything properly, and your space is spotless. People find you scary, but the ones you care about know how far you would go for them.","flaw":"Dust on any surface, anywhere.","item":"A cleaning rag and a cup of black tea","who":"The short, stern captain in Attack on Titan, known as humanity's strongest soldier and a cleaning fanatic."},
  {"name":"Mikasa Ackerman","jp":"ミカサ・アッカーマン","series":"Attack on Titan","role":"S","type":"kuu","g":"F","spot":"#e05a66","v":[5,5,0,3,0,1,1,0,0,1],"blurb":"You are quiet until someone touches your people. Your loyalty is total, your focus is frightening, and you are probably the strongest person in any room you walk into.","flaw":"One particular boy. Your friends have noticed.","item":"A red scarf","who":"Eren's adopted sister in Attack on Titan, a top soldier who wears a red scarf and protects him fiercely."},
  {"name":"Satoru Gojo","jp":"五条悟","series":"Jujutsu Kaisen","role":"S","type":"sado","g":"M","spot":"#5cc8ff","v":[3,1,3,4,5,0,1,5,0,0],"blurb":"You know you are good, and you find that very funny. You joke through situations that would break other people, and you make the impossible look like a light stretch.","flaw":"You are a nightmare to your own colleagues.","item":"A blindfold, worn as fashion","who":"A blindfolded teacher in Jujutsu Kaisen and the strongest sorcerer alive, who never stops joking about it."},
  {"name":"Kakashi Hatake","jp":"はたけカカシ","series":"Naruto","role":"S","type":"mentor","g":"M","spot":"#a7b6c2","v":[1,4,4,5,0,0,0,0,0,0],"blurb":"You turn up late, look half asleep and turn out to be the most capable person there. Under the laid-back act, you care deeply and you are thinking ten steps ahead.","flaw":"Being on time. There's always an excuse.","item":"A small orange book you're not allowed to read","who":"Naruto's laid-back, masked ninja teacher, famous for being late and for reading the same orange book."},
  {"name":"Nami","jp":"ナミ","series":"One Piece","role":"S","type":"strat","g":"F","spot":"#ffa04d","v":[1,2,5,1,2,5,1,2,1,0],"blurb":"You are the only one who has read the map and checked the budget. You are sharp, ambitious and great with money, and your crew would be lost in a day without you.","flaw":"You will absolutely charge your friends interest.","item":"A hand-drawn map and an invoice","who":"The navigator of the Straw Hat Pirates in One Piece, a sharp map-maker who loves money and keeps the crew alive."},
  {"name":"Power","jp":"パワー","series":"Chainsaw Man","role":"S","type":"hime","g":"F","spot":"#ff5e5e","v":[5,0,0,0,5,2,2,5,2,0],"blurb":"You lie, you boast, you have never done the dishes, and you are a great time. Rules are for other people, and somehow everyone ends up liking you anyway.","flaw":"Vegetables, baths and telling the truth.","item":"A cat named Meowy","who":"A loud, lying, bragging Blood Fiend in Chainsaw Man who becomes Denji's chaotic partner and roommate."},
  {"name":"Roronoa Zoro","jp":"ロロノア・ゾロ","series":"One Piece","role":"S","type":"lone","g":"M","spot":"#73d18d","v":[5,2,0,4,1,5,1,1,1,0],"blurb":"You are loyal, unbothered and always training or asleep. You will walk through anything for your captain, as long as somebody points you in the right direction first.","flaw":"Directions. You got lost going to the bathroom.","item":"Three swords, one held in his teeth","who":"The Straw Hat Pirates' swordsman in One Piece who fights with three swords and has no sense of direction."},
  {"name":"Sanji","jp":"サンジ","series":"One Piece","role":"S","type":"dere","g":"M","spot":"#ffd65c","v":[4,5,1,2,2,2,0,2,0,0],"blurb":"You cook for anyone who is hungry, no questions asked. You are stylish and fierce, a true romantic, and a total disaster around anyone you find attractive.","flaw":"Falling in love every eleven minutes.","item":"A neatly ironed chef's apron","who":"The Straw Hat Pirates' cook in One Piece, a kick-fighter and hopeless romantic who never lets anyone go hungry."},
  {"name":"Usopp","jp":"ウソップ","series":"One Piece","role":"S","type":"chuuni","g":"M","spot":"#d6ac6e","v":[0,4,3,0,5,1,0,3,0,2],"blurb":"You tell tall tales, your knees shake constantly, and you show up anyway. Everyone else is brave because they are strong. You are brave while terrified, which is harder.","flaw":"A sudden illness whenever danger is near.","item":"A slingshot and a fake nose","who":"The Straw Hat Pirates' sniper and tall-tale teller in One Piece, a coward who keeps choosing to be brave."},
  {"name":"Nico Robin","jp":"ニコ・ロビン","series":"One Piece","role":"S","type":"kuu","g":"F","spot":"#a693e6","v":[1,2,5,5,1,1,2,0,0,0],"blurb":"You sip your coffee, read your book and calmly mention the worst possible outcome. You are composed, clever and slightly morbid, and you found your family late but for good.","flaw":"Your jokes make the whole crew nervous.","item":"A history book and a cup of coffee","who":"The calm archaeologist of the Straw Hat Pirates in One Piece, the only person able to read an ancient script."},
  {"name":"Tony Tony Chopper","jp":"トニートニー・チョッパー","series":"One Piece","role":"S","type":"tsun","g":"M","spot":"#ffa6c2","v":[1,5,4,0,2,2,0,0,3,2],"blurb":"You are smart, soft-hearted and easily flattered. You want to cure every sickness in the world, and you get very bashful when anyone says you are doing a good job.","flaw":"Compliments. You dance and deny everything.","item":"A pink top hat and a medical bag","who":"The Straw Hat Pirates' doctor in One Piece: a reindeer who ate a magic fruit and can change size and shape."},
  {"name":"Shikamaru Nara","jp":"奈良シカマル","series":"Naruto","role":"S","type":"daru","g":"M","spot":"#9fbf8a","v":[1,3,5,4,0,0,0,0,0,0],"blurb":"You are probably the smartest person there, and you would like to go home. You find everything a total drag, then quietly work out how to save everybody.","flaw":"Effort. Just all of it.","item":"A shogi board","who":"A lazy genius ninja in Naruto who finds everything a drag and is the best strategist in his generation."},
  {"name":"Sakura Haruno","jp":"春野サクラ","series":"Naruto","role":"S","type":"tsun","g":"F","spot":"#ff9ecb","v":[4,4,4,1,1,4,0,1,2,0],"blurb":"You were never handed anything, so you built it yourself. You are clever, caring and capable of punching a crater into the ground if somebody makes you angry enough.","flaw":"Your temper, and the people who test it.","item":"Gloves, for punching and for medicine","who":"Naruto's teammate, a brilliant medical ninja with a temper and punches strong enough to split the ground."},
  {"name":"Hinata Hyuga","jp":"日向ヒナタ","series":"Naruto","role":"S","type":"dan","g":"F","spot":"#b7b2f0","v":[1,5,2,2,0,3,0,0,0,4],"blurb":"You are shy and gentle, and your courage is quiet but real. You support people from the background for years, and when it truly matters, you step straight to the front.","flaw":"Fainting at the worst possible moment.","item":"A small jar of healing ointment","who":"A shy ninja from a noble clan in Naruto who quietly admires Naruto for years and grows strong in her own way."},
  {"name":"Rock Lee","jp":"ロック・リー","series":"Naruto","role":"S","type":"nekketsu","g":"M","spot":"#74d68c","v":[5,3,0,0,1,5,0,2,0,0],"blurb":"You have no gift for the fancy stuff, so you outwork everybody. You set yourself absurd training penalties, and you are so sincere about it that nobody can laugh.","flaw":"Your fashion sense. One bright green jumpsuit.","item":"Ankle weights. Very heavy ones.","who":"A ninja in Naruto who can't use most ninja techniques, so he trains taijutsu harder than anyone alive."},
  {"name":"Gaara","jp":"我愛羅","series":"Naruto","role":"S","type":"kuu","g":"M","spot":"#d9a15f","v":[2,3,2,5,0,1,2,0,0,2],"blurb":"You started out lonely and dangerous, and you chose to change. You are quiet and serious, and you protect others because you know exactly how it feels to have no one.","flaw":"Small talk. Also, sleep.","item":"A gourd full of sand","who":"A sand-wielding ninja in Naruto who starts as a feared outcast and becomes his village's leader."},
  {"name":"Sasuke Uchiha","jp":"うちはサスケ","series":"Naruto","role":"S","type":"lone","g":"M","spot":"#8a9be0","v":[4,1,3,5,0,5,4,3,3,0],"blurb":"You are the brooding, talented rival, and you have a mission. You push people away, you make very dramatic exits, and you are still secretly part of the team.","flaw":"Talking about your feelings instead of leaving town.","item":"A headband with a scratch through it","who":"Naruto's brooding rival and teammate, the last heir of a famous clan, driven by a personal mission."},
  {"name":"Megumi Fushiguro","jp":"伏黒恵","series":"Jujutsu Kaisen","role":"S","type":"kuu","g":"M","spot":"#8fa0c9","v":[2,2,4,5,0,1,1,0,1,1],"blurb":"You are serious, quietly kind and tired of everyone's nonsense. You save the people you choose to save, and your dogs are the best part of your day.","flaw":"You never ask for help.","item":"Two shadow dogs, one black, one white","who":"A serious young sorcerer in Jujutsu Kaisen who summons shadow creatures, including two loyal dogs."},
  {"name":"Nobara Kugisaki","jp":"釘崎野薔薇","series":"Jujutsu Kaisen","role":"S","type":"tsun","g":"F","spot":"#ff8f70","v":[5,2,1,1,3,3,1,3,3,0],"blurb":"You moved to the big city because you refuse to be anything but yourself. You are bold and stylish, and you fight with a hammer. You also pick fights with people in shops.","flaw":"Being told a shopping trip must end.","item":"A hammer, nails and a straw doll","who":"A bold country girl turned Tokyo sorcerer in Jujutsu Kaisen who fights with a hammer, nails and a straw doll."},
  {"name":"Kento Nanami","jp":"七海建人","series":"Jujutsu Kaisen","role":"S","type":"mentor","g":"M","spot":"#f0d76c","v":[2,3,4,5,0,2,0,0,1,0],"blurb":"You are the only adult in the building. You treat your job as a job, you hate overtime, and you are deeply reliable. People feel safer the moment you walk in.","flaw":"Work after 6 p.m. You will take it personally.","item":"A wristwatch set exactly to 6 p.m.","who":"A former office worker turned sorcerer in Jujutsu Kaisen who treats curse-fighting as a job and hates overtime."},
  {"name":"Katsuki Bakugo","jp":"爆豪勝己","series":"My Hero Academia","role":"S","type":"tsun","g":"M","spot":"#ffa43a","v":[5,1,3,0,2,5,1,5,4,0],"blurb":"You are angry, gifted and shouting at someone right now. You demand to be number one, and behind the noise you work harder and think sharper than anyone expects.","flaw":"Saying literally anything in a normal voice.","item":"Grenade-shaped gauntlets","who":"Deku's explosive childhood rival in My Hero Academia, who can make explosions from his hands and yells constantly."},
  {"name":"Shoto Todoroki","jp":"轟焦凍","series":"My Hero Academia","role":"S","type":"kuu","g":"M","spot":"#f08a8a","v":[2,2,2,5,1,3,1,0,0,1],"blurb":"You are quiet, powerful and accidentally hilarious. You came from a difficult home and you are working out who you want to be, one very literal statement at a time.","flaw":"You did not know that was a joke.","item":"Half a bowl of cold soba","who":"A quiet, powerful student in My Hero Academia who can use both ice and fire, and is very literal."},
  {"name":"All Might","jp":"オールマイト","series":"My Hero Academia","role":"S","type":"mentor","g":"M","spot":"#ffd24d","v":[5,5,1,1,0,3,0,5,0,0],"blurb":"You are the mentor with the huge smile, and you never let people see you struggle. You make everyone feel safe, you arrive with a big entrance, and you always teach by example.","flaw":"Stairs, after the smile drops.","item":"A costume that's one size too big now","who":"The world's greatest hero in My Hero Academia, a symbol of peace who mentors Deku."},
  {"name":"Shota Aizawa","jp":"相澤消太","series":"My Hero Academia","role":"S","type":"daru","g":"M","spot":"#a6adc0","v":[1,2,4,5,0,1,0,0,1,0],"blurb":"You are exhausted and you sleep in a yellow sleeping bag at work. You act strict because you care, and you have no patience at all for anything that wastes time.","flaw":"Bedtime starts wherever you currently are.","item":"A yellow sleeping bag","who":"Class 1-A's tired, strict homeroom teacher in My Hero Academia, whose stare cancels other people's powers."},
  {"name":"Inosuke Hashibira","jp":"嘴平伊之助","series":"Demon Slayer","role":"S","type":"baka","g":"M","spot":"#7fb6e0","v":[5,1,0,0,5,3,0,5,2,0],"blurb":"You were raised by boars and you bring that energy everywhere. You headbutt first, you challenge everything to a fight, and you are very confused by kindness.","flaw":"Nobody can get your name right. Neither can you.","item":"A boar mask","who":"A demon slayer in Demon Slayer who was raised by boars, wears a boar mask and challenges everything to a fight."},
  {"name":"Zenitsu Agatsuma","jp":"我妻善逸","series":"Demon Slayer","role":"S","type":"baka","g":"M","spot":"#ffe066","v":[1,4,0,0,4,0,0,1,0,2],"blurb":"You scream, you panic, you beg to go home, and then you do something incredible. You have no faith in yourself at all, and your friends have plenty of it for you.","flaw":"You're awake right now, which is the problem.","item":"A very judgemental sparrow","who":"A cowardly, screaming demon slayer in Demon Slayer who becomes a lightning-fast swordsman when he passes out."},
  {"name":"Killua Zoldyck","jp":"キルア・ゾルディック","series":"Hunter x Hunter","role":"S","type":"tsun","g":"M","spot":"#b3d4ff","v":[3,3,4,4,2,1,3,0,3,0],"blurb":"You grew up in a family of assassins and you chose your friend instead. You are sharp, mischievous and fiercely protective, and you always have a sweet snack with you.","flaw":"Your family group chat would be terrifying.","item":"A box of chocolate robots","who":"Gon's best friend in Hunter x Hunter, a runaway heir from a family of assassins with lightning powers."},
  {"name":"Kurapika","jp":"クラピカ","series":"Hunter x Hunter","role":"S","type":"lone","g":"M","spot":"#f0d66e","v":[3,3,4,4,0,5,4,0,1,0],"blurb":"You are polite, principled and burning with a very specific anger. You have made a promise to yourself, and you will pay any price to keep it, including yourself.","flaw":"You could use one single day off.","item":"A chain on his right hand","who":"A calm, principled member of Gon's group in Hunter x Hunter, driven by a quest for justice for his clan."},
  {"name":"Roy Mustang","jp":"ロイ・マスタング","series":"Fullmetal Alchemist: Brotherhood","role":"S","type":"strat","g":"M","spot":"#7e96e6","v":[3,3,5,3,0,5,1,3,0,0],"blurb":"You act lazy and flirtatious while climbing the ranks with a serious plan. You protect your team, you hide your ambition well, and you get very smug about it.","flaw":"Rainy days, and paperwork.","item":"Ignition gloves. Useless in the rain.","who":"The Flame Alchemist in Fullmetal Alchemist: Brotherhood, a flirtatious colonel with big plans to reach the top."},
  {"name":"Riza Hawkeye","jp":"リザ・ホークアイ","series":"Fullmetal Alchemist: Brotherhood","role":"S","type":"kuu","g":"F","spot":"#d9c07a","v":[3,4,3,5,0,2,1,0,0,1],"blurb":"You are the reason the person in charge is still alive. You are disciplined, loyal and a perfect shot, and you have the strongest will in the room. You simply do not mention it.","flaw":"You are the only one doing the paperwork.","item":"Two handguns and a small dog","who":"Roy Mustang's loyal lieutenant and expert sharpshooter in Fullmetal Alchemist: Brotherhood."},
  {"name":"Alphonse Elric","jp":"アルフォンス・エルリック","series":"Fullmetal Alchemist: Brotherhood","role":"S","type":"dere","g":"M","spot":"#d6b872","v":[1,5,4,2,0,2,0,0,0,1],"blurb":"You are the gentle one. You are thoughtful, wise beyond your years and the moral centre of your whole family. You also bring home stray cats, no matter what you were told.","flaw":"Saying no to a stray cat.","item":"A cat hidden where it shouldn't be","who":"Edward's gentle younger brother in Fullmetal Alchemist: Brotherhood, whose soul is bound to a suit of armour."},
  {"name":"Armin Arlert","jp":"アルミン・アルレルト","series":"Attack on Titan","role":"S","type":"strat","g":"M","spot":"#f0d98a","v":[1,4,5,1,0,2,1,0,0,2],"blurb":"You don't look strong, and you are the one with the plan. You dream about the ocean, you doubt yourself constantly, and your ideas keep saving everyone's lives.","flaw":"Believing you deserve to be there.","item":"A forbidden book about the ocean","who":"Eren's best friend in Attack on Titan, physically weak but the group's sharpest strategist."},
  {"name":"Sasha Braus","jp":"サシャ・ブラウス","series":"Attack on Titan","role":"S","type":"baka","g":"F","spot":"#d9a26c","v":[1,3,0,0,5,1,0,1,0,0],"blurb":"You were caught eating a potato at the worst possible time, and that sums you up. You are funny, hungry and easy to love, with far more heart than people expect.","flaw":"You have stolen food from a commanding officer.","item":"A stolen potato","who":"A food-obsessed, funny soldier in Attack on Titan, famous for eating a potato at the worst possible moment."},
  {"name":"Hange Zoe","jp":"ハンジ・ゾエ","series":"Attack on Titan","role":"S","type":"genki","g":"X","spot":"#d48a63","v":[3,3,5,0,5,3,0,1,0,0],"blurb":"You get far too excited about dangerous things. You are a brilliant, chaotic researcher, and your colleagues have to remind you to eat, wash and step away from the subject.","flaw":"Your assistants have filed a safety complaint.","item":"Goggles and a sample jar","who":"An eccentric, brilliant scientist and commander in Attack on Titan who is fascinated by the Titans."},
  {"name":"Kenma Kozume","jp":"孤爪研磨","series":"Haikyu!!","role":"S","type":"daru","g":"M","spot":"#f0c060","v":[0,1,5,4,1,0,0,0,1,3],"blurb":"You would like to play your game in peace. You read people perfectly, you hate attention and getting sweaty, and you are quietly the brain of the whole team.","flaw":"Being looked at by more than three people.","item":"A handheld game console","who":"The quiet, gamer setter of the Nekoma team in Haikyu!!, who reads every player like a strategy game."},
  {"name":"Kei Tsukishima","jp":"月島蛍","series":"Haikyu!!","role":"S","type":"tsun","g":"M","spot":"#f2e38f","v":[0,0,4,5,2,0,2,0,3,0],"blurb":"You are tall, sarcastic and allergic to enthusiasm. You act like you don't care because caring is embarrassing, and then you make the play that changes everything.","flaw":"Admitting you are enjoying yourself.","item":"Headphones, for ignoring you","who":"The tall, sarcastic middle blocker in Haikyu!! who acts like he doesn't care about volleyball."},
  {"name":"Misa Amane","jp":"弥海砂","series":"Death Note","role":"S","type":"yan","g":"F","spot":"#f09cc0","v":[3,4,0,0,4,2,2,3,0,0],"blurb":"You are a loud, sparkly superstar who is completely devoted. You give your whole heart to your person, and you are much more dangerous than people think.","flaw":"Your taste in partners. Please talk to a friend.","item":"A gothic dress and a notebook","who":"A pop idol in Death Note who is utterly devoted to Light, and has her own notebook."},
  {"name":"Rem","jp":"レム","series":"Re:Zero","role":"S","type":"dere","g":"F","spot":"#8ec5ff","v":[4,5,2,2,0,2,2,0,0,1],"blurb":"You are devoted, hard-working and rather intimidating when your loved ones are threatened. You believe in someone when nobody else does, and it changes their whole life.","flaw":"You are harsh on yourself, and only yourself.","item":"A morning star, kept spotless","who":"A blue-haired maid in Re:Zero who becomes fiercely devoted to the hero after a rocky start."},
  {"name":"Bulma","jp":"ブルマ","series":"Dragon Ball","role":"S","type":"hime","g":"F","spot":"#6fd7d0","v":[3,2,5,0,3,3,0,4,2,0],"blurb":"You are a genius inventor who bosses around the strongest people in the universe, and they listen. You are glamorous and fearless, and you have a machine for that.","flaw":"Being told something is impossible.","item":"A capsule that turns into a motorbike","who":"A genius inventor in Dragon Ball who kicks off the whole story by hunting for the magic Dragon Balls."},
  {"name":"Piccolo","jp":"ピッコロ","series":"Dragon Ball","role":"S","type":"mentor","g":"M","spot":"#83d67e","v":[3,4,4,5,0,1,1,0,2,1],"blurb":"You seem stern and you stand alone with your arms crossed. In truth, you are the world's best babysitter, and that child is the most important person in your life.","flaw":"You keep getting asked to do the childcare.","item":"A weighted cape and turban","who":"A stern green Namekian warrior in Dragon Ball who goes from enemy to mentor to devoted babysitter."},
  {"name":"Vegeta","jp":"ベジータ","series":"Dragon Ball","role":"S","type":"tsun","g":"M","spot":"#7a9ae8","v":[5,1,2,3,0,5,2,5,4,0],"blurb":"You are a proud prince who is forever number two, and you will never accept that. You train furiously, you complain constantly, and you love your family more than you will admit.","flaw":"Goku. It's always Goku.","item":"A battered scouter","who":"The proud prince of the Saiyans in Dragon Ball, Goku's eternal rival who hates being second best."},
  {"name":"Kyo Sohma","jp":"草摩夾","series":"Fruits Basket","role":"S","type":"tsun","g":"M","spot":"#ff9b5e","v":[4,3,0,0,2,3,1,1,4,0],"blurb":"You are prickly on the outside, and you yell at people who are being nice to you. Underneath, you are a soft person who has never quite believed you deserve to be cared for.","flaw":"Rainy days. Also, leeks.","item":"A bead bracelet he never takes off","who":"The short-tempered boy in Fruits Basket cursed to turn into a cat, who fights with everyone except Tohru."},
  {"name":"Tamaki Suoh","jp":"須王環","series":"Ouran High School Host Club","role":"S","type":"hime","g":"M","spot":"#f5c469","v":[2,5,0,0,5,1,0,5,0,0],"blurb":"You are a dramatic prince with a heart of gold. You make every moment into a performance, you sulk in corners, and you truly want every person around you to be happy.","flaw":"Being ignored. You'll grow mushrooms in the corner.","item":"A single red rose","who":"The dramatic, princely president of the Host Club in Ouran High School Host Club."},
  {"name":"Fern","jp":"フェルン","series":"Frieren: Beyond Journey's End","role":"S","type":"kuu","g":"F","spot":"#c5b3e8","v":[1,3,3,4,0,2,0,0,2,1],"blurb":"You are the responsible one who wakes everyone up. You are quietly talented, you pout instead of shouting, and you keep your entire travelling party alive and on schedule.","flaw":"You've been pouting for three towns now.","item":"An alarm clock, for Frieren","who":"Frieren's young apprentice in Frieren: Beyond Journey's End, the responsible one who keeps their party on schedule."},
  {"name":"Ryuk","jp":"リューク","series":"Death Note","role":"S","type":"sado","g":"M","spot":"#c7c1d8","v":[0,0,2,4,5,0,3,1,0,0],"blurb":"You are here purely for the entertainment. You watch everything fall apart from a safe distance, you laugh a lot, and you can be bought with fruit.","flaw":"Apple withdrawal. It gets strange.","item":"An apple. Always an apple.","who":"The apple-loving death god in Death Note who drops the notebook into the human world because he's bored."},
  {"name":"Asuka Langley Soryu","jp":"惣流・アスカ・ラングレー","series":"Neon Genesis Evangelion","role":"S","type":"tsun","g":"F","spot":"#ff5a4f","v":[4,1,4,1,2,5,2,5,5,0],"blurb":"You are brilliant, competitive and determined to be the best in any room. Admitting you need anyone is the one thing you refuse to do.","flaw":"Losing. Being ignored. Being helped. In that order.","item":"A pair of red hair clips","who":"A brilliant, fiery giant-robot pilot in Neon Genesis Evangelion who needs to be the best."},
  {"name":"Rin Tohsaka","jp":"遠坂凛","series":"Fate/stay night","role":"S","type":"tsun","g":"F","spot":"#e04a5a","v":[3,3,5,2,2,4,1,3,4,0],"blurb":"You are the perfect honour student by day and a serious magician by night. You plan everything, you hate owing anyone, and you are much kinder than you'll ever admit.","flaw":"Your family's famous bad luck, always at the crucial moment.","item":"A ruby pendant","who":"A top student and skilled magician in Fate/stay night who joins a secret war between mages."},
  {"name":"Kurisu Makise","jp":"牧瀬紅莉栖","series":"Steins;Gate","role":"S","type":"tsun","g":"F","spot":"#c95454","v":[1,3,5,2,1,4,0,1,4,1],"blurb":"You are a genius scientist with no patience for nonsense, especially nonsense from people you like. You argue hard, think fast and secretly enjoy the attention.","flaw":"Being given a nickname. Any nickname.","item":"A lab coat and a can of fizzy soda","who":"A teenage neuroscience genius in Steins;Gate who joins a ragtag lab that accidentally invents time travel."},
  {"name":"Louise","jp":"ルイズ","series":"The Familiar of Zero","role":"S","type":"tsun","g":"F","spot":"#ff9ad5","v":[2,2,3,1,4,3,1,4,5,0],"blurb":"You are a proud noble with something to prove and a spell that only ever explodes. You order people around because you're scared they'll leave, and you never say sorry first.","flaw":"Every spell you cast. Every single one.","item":"A wand with a scorch mark","who":"A proud noble student in The Familiar of Zero whose spells always explode, and who summons an ordinary boy as her familiar."},
  {"name":"Rei Ayanami","jp":"綾波レイ","series":"Neon Genesis Evangelion","role":"S","type":"kuu","g":"F","spot":"#8aa6ff","v":[2,2,3,5,0,1,1,0,0,3],"blurb":"You are calm, quiet and hard to read, and you move through the world like you're still learning how it works. When you do feel something, it's strong and real.","flaw":"Small talk. And meat.","item":"A pair of cracked glasses","who":"A quiet, mysterious giant-robot pilot in Neon Genesis Evangelion who barely shows emotion."},
  {"name":"Yuki Nagato","jp":"長門有希","series":"The Melancholy of Haruhi Suzumiya","role":"S","type":"kuu","g":"F","spot":"#a7b8d9","v":[1,2,5,5,0,1,1,0,0,4],"blurb":"You speak in the fewest words possible and you know more than everyone in the room put together. You read constantly, and you'd quietly rewrite reality for a friend.","flaw":"Explaining anything in more than four words.","item":"A very thick science-fiction novel","who":"The silent book-reading member of the SOS Brigade in The Melancholy of Haruhi Suzumiya, who is much more than she seems."},
  {"name":"Mai Sakurajima","jp":"桜島麻衣","series":"Rascal Does Not Dream of Bunny Girl Senpai","role":"S","type":"sado","g":"F","spot":"#7d6be0","v":[2,4,4,4,1,2,1,3,2,0],"blurb":"You are poised, sharp and a little bit of a tease. You've been in the spotlight forever, so you see through people fast, and you're quietly loyal to the few who see you too.","flaw":"Pretending you're not jealous. You're very jealous.","item":"A library book, overdue on purpose","who":"A famous actress in Rascal Does Not Dream of Bunny Girl Senpai who starts becoming invisible to everyone around her."},
  {"name":"Erina Nakiri","jp":"薙切えりな","series":"Food Wars!","role":"S","type":"hime","g":"F","spot":"#ffd27a","v":[2,1,5,3,0,4,2,4,4,0],"blurb":"You have a legendary palate and the standards to match. You expect perfection, you deliver it, and you're secretly delighted when someone finally surprises you.","flaw":"Admitting that cheap food tasted good.","item":"A gold-trimmed tasting spoon","who":"The haughty culinary prodigy in Food Wars! with a legendary sense of taste and impossible standards."},
  {"name":"Aqua","jp":"アクア","series":"KonoSuba","role":"S","type":"hime","g":"F","spot":"#66c6ff","v":[1,3,0,0,5,0,0,5,2,0],"blurb":"You are a goddess, and you mention it often. You're useless in a crisis, brilliant at parties, and you cry loudly when things don't go your way.","flaw":"Money, planning and giant frogs.","item":"A staff she mostly uses for party tricks","who":"A water goddess in KonoSuba who gets dragged into a fantasy world as an adventurer and is mostly useless at it."},
  {"name":"Megumin","jp":"めぐみん","series":"KonoSuba","role":"S","type":"chuuni","g":"F","spot":"#d24a4a","v":[3,2,3,1,5,4,1,5,2,0],"blurb":"You have one spell, it's the biggest explosion in the world, and you refuse to learn anything else. You're dramatic, dedicated and completely committed to the bit.","flaw":"After one spell you collapse and someone has to carry you home.","item":"An eye patch she doesn't need","who":"A dramatic young mage in KonoSuba who only knows one spell, the most powerful explosion there is."},
  {"name":"Chika Fujiwara","jp":"藤原千花","series":"Kaguya-sama: Love Is War","role":"S","type":"baka","g":"F","spot":"#ff9ec2","v":[1,4,1,0,5,1,1,4,0,0],"blurb":"You are a walking party. You love games, songs and chaos, and you wreck everyone's carefully laid plans without ever noticing.","flaw":"Keeping a secret for more than four minutes.","item":"A detective hat and a box of board games","who":"The bubbly, chaotic secretary of the student council in Kaguya-sama: Love Is War, who loves games and songs."},
  {"name":"Kamina","jp":"カミナ","series":"Gurren Lagann","role":"S","type":"nekketsu","g":"M","spot":"#ff4a3d","v":[5,4,0,1,4,5,0,5,1,0],"blurb":"You are the loudest believer in any room. You believe in your friends so hard that they start believing in themselves, and you never once look back.","flaw":"Sunglasses indoors. And underground.","item":"Pointed sunglasses and a cape","who":"The loud, caped big-brother figure in Gurren Lagann who leads the charge from an underground village to the surface."},
  {"name":"Jiraiya","jp":"自来也","series":"Naruto","role":"S","type":"mentor","g":"M","spot":"#e65b5b","v":[4,4,4,2,4,2,0,4,0,0],"blurb":"You are a legendary sage and a shameless romantic who writes questionable novels. You act like a clown, but you're the teacher who never stops believing in the kid nobody believed in.","flaw":"Research trips to the hot springs.","item":"A giant scroll and an unfinished novel","who":"One of Naruto's legendary sages, a toad summoner and novelist who becomes Naruto's teacher."},
  {"name":"Holo","jp":"ホロ","series":"Spice and Wolf","role":"S","type":"sado","g":"F","spot":"#d0903f","v":[2,3,5,3,2,2,1,2,1,0],"blurb":"You are centuries old, very wise and extremely proud of your tail. You tease people without mercy, you love apples and wine, and you hate being lonely.","flaw":"Being called old. Or being left alone.","item":"A pouch of wheat and a basket of apples","who":"A centuries-old wolf goddess in Spice and Wolf who travels with a merchant and loves apples and wine."},
  {"name":"Erza Scarlet","jp":"エルザ・スカーレット","series":"Fairy Tail","role":"S","type":"nekketsu","g":"F","spot":"#e8433a","v":[5,4,3,3,1,5,1,3,2,0],"blurb":"You are the strict, armoured, unstoppable one who keeps a whole rowdy group in line. You're terrifying when angry and secretly sentimental about cake and your friends.","flaw":"Anyone touching your strawberry cake.","item":"A wardrobe of magic armour","who":"The armour-swapping top mage of the Fairy Tail guild, feared and respected by every rowdy member."},
  {"name":"Maki Zenin","jp":"禪院真希","series":"Jujutsu Kaisen","role":"S","type":"nekketsu","g":"F","spot":"#4f9a62","v":[5,2,2,3,1,5,1,2,3,0],"blurb":"You were told you weren't enough, so you got strong enough to make everyone regret saying it. You're blunt, tough and loyal to your few friends.","flaw":"Your family. All of them.","item":"A cursed spear and a pair of glasses","who":"A sorcerer in Jujutsu Kaisen born with almost no cursed energy, who fights with weapons and sheer strength."},
  {"name":"Tsunade","jp":"綱手","series":"Naruto","role":"S","type":"mentor","g":"F","spot":"#7fc28a","v":[5,4,4,2,3,3,0,3,2,0],"blurb":"You're a legendary healer with a monstrous punch, a gambling habit and a soft spot for reckless kids. You'd rather not be in charge, and you're brilliant at it.","flaw":"Gambling. You always lose.","item":"A pile of unpaid IOUs","who":"One of Naruto's legendary sages: the greatest medical ninja alive, with super strength and famously bad luck at gambling."},
  {"name":"Yoruichi Shihoin","jp":"四楓院夜一","series":"Bleach","role":"S","type":"mentor","g":"F","spot":"#b58cff","v":[4,3,3,4,4,2,1,2,0,0],"blurb":"You're the fastest person in any room and the most relaxed about it. You tease your students, vanish without warning, and always turn up when it matters.","flaw":"Taking anything seriously before it's urgent.","item":"A black cat form, for travelling","who":"A former captain in Bleach known as the Flash Goddess, who often gets around as a talking black cat."},
  {"name":"Revy","jp":"レヴィ","series":"Black Lagoon","role":"S","type":"lone","g":"F","spot":"#b0683f","v":[5,1,1,3,4,2,4,1,3,0],"blurb":"You're blunt, fast and permanently unimpressed. You trust almost no one, and the few people you protect never hear a nice word about it.","flaw":"Manners, patience and the word please.","item":"A pair of pistols","who":"A ruthless gunslinger in Black Lagoon who works for a small smuggling crew in a lawless port city."},
  {"name":"Akame","jp":"アカメ","series":"Akame ga Kill!","role":"S","type":"lone","g":"F","spot":"#d12f3a","v":[4,4,2,5,0,4,3,0,0,1],"blurb":"You're quiet, focused and deadly, and also always hungry. You carry heavy things alone so your friends don't have to.","flaw":"Meat. You'll always want more.","item":"A cursed sword","who":"The quiet swordswoman of the assassin group Night Raid in Akame ga Kill!, fighting a corrupt empire."},
  {"name":"Aru Akise","jp":"秋瀬或","series":"Future Diary","role":"S","type":"yan","g":"M","spot":"#d8c070","v":[1,4,5,4,1,3,3,1,0,0],"blurb":"You're a charming detective who decides very quickly who matters to you, and then you'd rewrite the world for them. Intense devotion, calm smile.","flaw":"Not knowing when to stop investigating.","item":"A detective's notebook","who":"A teenage detective in Future Diary who becomes intensely devoted to the hero during a deadly survival game."},
  {"name":"Nezuko Kamado","jp":"竈門禰豆子","series":"Demon Slayer","role":"S","type":"dere","g":"F","spot":"#f28cb1","v":[4,5,0,2,2,2,1,1,0,3],"blurb":"You don't say much, but everyone knows exactly where they stand with you: protected. You're gentle, fierce when it counts, and you can nap through anything.","flaw":"Sunlight. And sitting still in a box for hours.","item":"A bamboo muzzle and a pink ribbon","who":"Tanjiro's little sister in Demon Slayer, turned into a demon but still fighting to protect humans and her brother."},
  {"name":"Kyojuro Rengoku","jp":"煉獄杏寿郎","series":"Demon Slayer","role":"S","type":"mentor","g":"M","spot":"#ff7a1f","v":[5,5,1,1,1,5,0,5,0,0],"blurb":"You are pure blazing enthusiasm. You praise loudly, eat enormously and believe in the younger ones with your whole chest. People leave your presence braver.","flaw":"Shouting 'delicious!' after every bite. Every bite.","item":"A flame-patterned cloak and a box of bento","who":"The Flame Hashira in Demon Slayer, a booming, warm-hearted swordsman who mentors Tanjiro and his friends."},
  {"name":"Shinobu Kocho","jp":"胡蝶しのぶ","series":"Demon Slayer","role":"S","type":"doro","g":"F","spot":"#b98cff","v":[2,3,5,4,1,4,4,1,1,0],"blurb":"You smile constantly, speak softly and are absolutely furious underneath. You're brilliant, precise and you never forget a single wrong.","flaw":"The smile never reaches your eyes when you're angry. Everyone can tell.","item":"A butterfly hairpin and a needle-thin sword","who":"The Insect Hashira in Demon Slayer, a smiling poison expert and doctor who is much angrier than she lets on."},
  {"name":"Giyu Tomioka","jp":"冨岡義勇","series":"Demon Slayer","role":"S","type":"kuu","g":"M","spot":"#4a7fd6","v":[4,3,2,5,0,2,1,0,1,4],"blurb":"You say about four words a day and people assume you hate them. You don't. You just forgot to explain. Again.","flaw":"Explaining yourself. At all.","item":"A haori made of two different patterns","who":"The Water Hashira in Demon Slayer, the quiet swordsman who first meets Tanjiro and decides to spare his sister."},
  {"name":"Mitsuri Kanroji","jp":"甘露寺蜜璃","series":"Demon Slayer","role":"S","type":"dere","g":"F","spot":"#ff8fc0","v":[5,5,1,0,2,3,0,3,0,1],"blurb":"You are strong, sweet and in love with roughly everyone's good qualities. You blush easily, eat three times your share and fight like a whirlwind.","flaw":"Your heart skips at literally everything.","item":"A whip-thin flexible sword","who":"The Love Hashira in Demon Slayer, a super-strong, very affectionate swordswoman who is looking for a husband stronger than her."},
  {"name":"Yuta Okkotsu","jp":"乙骨憂太","series":"Jujutsu Kaisen","role":"S","type":"dan","g":"M","spot":"#9db6e8","v":[4,4,3,2,1,3,2,0,0,4],"blurb":"You're polite, anxious and apologetic, and you are secretly one of the most powerful people anywhere. You're learning that you're allowed to want things.","flaw":"Saying sorry before anyone's even upset.","item":"A ring on a chain and a sword case","who":"The shy lead of Jujutsu Kaisen 0, a student haunted by the spirit of his childhood friend who becomes an elite sorcerer."},
  {"name":"Aki Hayakawa","jp":"早川アキ","series":"Chainsaw Man","role":"S","type":"lone","g":"M","spot":"#5e7a96","v":[3,4,3,4,0,4,2,0,2,1],"blurb":"You're serious, responsible and quietly carrying a lot. You keep your apartment tidy, cook for your chaotic roommates and pretend you don't care about them.","flaw":"Smoking on the balcony and thinking about the past.","item":"A katana and a topknot","who":"A disciplined devil hunter in Chainsaw Man who ends up sharing an apartment with Denji and Power."},
  {"name":"Boa Hancock","jp":"ボア・ハンコック","series":"One Piece","role":"S","type":"hime","g":"F","spot":"#d42a5a","v":[4,2,2,3,1,2,2,5,4,0],"blurb":"You are the most beautiful person in the world and you'll tell anyone who asks. Haughty to everyone, completely melted by one person.","flaw":"Leaning back so far in arrogance that you bend backwards.","item":"A snake companion named Salome","who":"The Pirate Empress of Amazon Lily in One Piece, famously beautiful, famously arrogant, and smitten with Luffy."},
  {"name":"Trafalgar Law","jp":"トラファルガー・ロー","series":"One Piece","role":"S","type":"strat","g":"M","spot":"#ffcf3a","v":[3,2,5,5,0,4,3,1,2,0],"blurb":"You're a cool, calculating schemer who says he's only in it for himself. You make alliances 'for strategic reasons' and then protect everyone anyway.","flaw":"Bread. You hate bread.","item":"A spotted hat and a very long sword","who":"A pirate captain and surgeon in One Piece whose power turns any space into an operating room. Teams up with Luffy."},
  {"name":"Portgas D. Ace","jp":"ポートガス・D・エース","series":"One Piece","role":"S","type":"nekketsu","g":"M","spot":"#ff6a2a","v":[5,4,1,2,3,4,1,3,1,0],"blurb":"You're a fiery, free-spirited older sibling with impeccable manners and zero chill. You'll fall asleep mid-meal and fight an army for your family.","flaw":"Falling asleep in your food. Mid-sentence.","item":"An orange hat with two little faces on it","who":"Luffy's older brother in One Piece, a pirate with fire powers and a fierce loyalty to the crew that adopted him."},
  {"name":"Erwin Smith","jp":"エルヴィン・スミス","series":"Attack on Titan","role":"S","type":"strat","g":"M","spot":"#5b8bd9","v":[4,2,5,4,0,5,3,4,0,0],"blurb":"You're a born commander who can make people march into the impossible with one speech. You carry a huge question inside you and the plan is always bigger than it looks.","flaw":"Your dream, which nobody else knows about.","item":"A Survey Corps cloak and a very good speech","who":"The commander of the Survey Corps in Attack on Titan, a brilliant, ruthless strategist who leads humanity's scouts."},
  {"name":"Ochaco Uraraka","jp":"麗日お茶子","series":"My Hero Academia","role":"S","type":"genki","g":"F","spot":"#ff9cb0","v":[4,5,2,1,2,4,0,2,0,1],"blurb":"You're bright, determined and much tougher than your round cheeks suggest. You want to be a hero for very practical reasons, and you'll punch your way there.","flaw":"Getting motion-sick from your own power.","item":"A pink-and-black hero costume","who":"Deku's friend and classmate in My Hero Academia who can make anything she touches float."},
  {"name":"Tobio Kageyama","jp":"影山飛雄","series":"Haikyu!!","role":"S","type":"tsun","g":"M","spot":"#3a5ad9","v":[4,2,3,2,1,5,1,2,4,1],"blurb":"You're a prodigy with a scary face and no idea how to talk to people. You yell 'idiot' at your best friend and then set him the perfect ball, every time.","flaw":"Smiling. Your smile frightens small children.","item":"A carton of milk, always","who":"Karasuno's genius setter in Haikyu!!, a former 'King of the Court' who forms an unstoppable duo with Hinata."},
  {"name":"Toru Oikawa","jp":"及川徹","series":"Haikyu!!","role":"S","type":"sado","g":"M","spot":"#5ec8c0","v":[3,3,4,2,3,5,2,5,1,0],"blurb":"You're charming, annoying and one of the hardest workers anywhere. You tease everyone and smile for your fans, and you will never, ever stop trying to win.","flaw":"A certain genius junior who keeps getting better.","item":"Milk bread and a fan club","who":"The flashy, brilliant captain and setter of rival school Aoba Johsai in Haikyu!!, and Kageyama's old senior."},
  {"name":"Winry Rockbell","jp":"ウィンリィ・ロックベル","series":"Fullmetal Alchemist: Brotherhood","role":"S","type":"tsun","g":"F","spot":"#ffd24d","v":[3,5,4,1,2,4,0,1,3,0],"blurb":"You're a brilliant mechanic with a wrench and a temper. You yell at the people you love for breaking things, then stay up all night fixing them.","flaw":"Throwing your wrench. Accurately.","item":"A well-loved wrench","who":"The Elric brothers' childhood friend in Fullmetal Alchemist: Brotherhood, a gifted automail mechanic."},
  {"name":"Rukia Kuchiki","jp":"朽木ルキア","series":"Bleach","role":"S","type":"mentor","g":"F","spot":"#7a8de8","v":[3,4,3,4,1,3,1,1,2,0],"blurb":"You're small, bossy and sure of yourself, and you'll drag someone kicking and screaming into their destiny. Also, you draw terrible rabbits.","flaw":"Your drawings. Please stop drawing rabbits.","item":"A sketchbook full of bunnies","who":"The Soul Reaper in Bleach who gives Ichigo his powers and becomes his partner and closest ally."},
  {"name":"Damian Desmond","jp":"ダミアン・デズモンド","series":"Spy x Family","role":"S","type":"tsun","g":"M","spot":"#5a7a6a","v":[2,3,2,1,2,3,1,3,5,1],"blurb":"You're a proud little rich kid who insults the person you like and then panics when they're upset. You're trying so hard to make your dad proud.","flaw":"Saying anything nice to anyone. Out loud.","item":"A school uniform with a gold badge","who":"A spoiled classmate of Anya in Spy x Family, son of the politician Loid is spying on, who secretly likes her."},
  {"name":"Kana Arima","jp":"有馬かな","series":"Oshi no Ko","role":"S","type":"tsun","g":"F","spot":"#ff5a5a","v":[3,3,3,2,2,4,1,4,4,1],"blurb":"You were a famous child actor and you're still fighting to stay in the spotlight. You're prickly, insecure and incredibly talented, and you notice everyone who supports you.","flaw":"Hearing the words 'former child star'.","item":"A beret and a script full of notes","who":"A former child actor in Oshi no Ko trying to revive her career, sharp-tongued and secretly very caring."},
  {"name":"Arataka Reigen","jp":"霊幻新隆","series":"Mob Psycho 100","role":"S","type":"mentor","g":"M","spot":"#9bc35a","v":[3,4,4,3,3,2,1,4,0,0],"blurb":"You're a self-proclaimed psychic with no powers and endless confidence. You bluff your way through everything, and somehow give the best life advice anyone's ever heard.","flaw":"Being asked to actually demonstrate your powers.","item":"A bottle of salt and a business card","who":"Mob's con-artist boss in Mob Psycho 100, a fake psychic who turns out to be a genuinely great mentor."},
  {"name":"Ram","jp":"ラム","series":"Re:Zero","role":"S","type":"sado","g":"F","spot":"#ff9ac8","v":[2,3,3,4,1,1,2,3,3,0],"blurb":"You're a maid who does about a third of the work and gives about all of the attitude. You insult people with perfect calm, and you're fiercely protective of your sister.","flaw":"Cooking anything except steamed potatoes.","item":"A maid uniform and a magic wand","who":"Rem's older twin sister in Re:Zero, a sharp-tongued maid with wind magic and supreme self-confidence."},
  {"name":"Nijika Ijichi","jp":"伊地知虹夏","series":"Bocchi the Rock!","role":"S","type":"genki","g":"F","spot":"#ffd23f","v":[2,5,3,1,1,4,0,2,0,0],"blurb":"You're the sunny glue that holds the band together. You drum, you organise, you check on the shy one, and you quietly carry a big dream of your own.","flaw":"Being the only responsible member of the band.","item":"Drumsticks and a triangle-shaped side ponytail","who":"The upbeat drummer and leader of Kessoku Band in Bocchi the Rock!, who invites Bocchi into the band."},
  {"name":"Ryo Yamada","jp":"山田リョウ","series":"Bocchi the Rock!","role":"S","type":"daru","g":"F","spot":"#4a78c8","v":[1,2,3,5,3,1,1,1,0,2],"blurb":"You're cool, deadpan and permanently broke. You eat weeds to save money, borrow cash from everyone, and play bass better than anyone you know.","flaw":"Paying people back.","item":"A bass guitar and a bag of wild grass","who":"The cool, eccentric bassist of Kessoku Band in Bocchi the Rock!, famous for borrowing money and eating weeds."},
  {"name":"Faye Valentine","jp":"フェイ・ヴァレンタイン","series":"Cowboy Bebop","role":"S","type":"sado","g":"F","spot":"#ffd93d","v":[3,1,3,3,4,1,3,3,3,0],"blurb":"You're a gambler, a con artist and a total mystery even to yourself. You tease, cheat and lie with style, and you don't trust anyone, especially the ones you like.","flaw":"Debt. Mountains of it.","item":"A deck of cards and an unpaid tab","who":"A gambler and con artist on the bounty-hunting ship in Cowboy Bebop, with debts and a past she can't remember."},
  {"name":"Himmel","jp":"ヒンメル","series":"Frieren: Beyond Journey's End","role":"S","type":"hime","g":"M","spot":"#6fb5f2","v":[4,5,2,3,2,3,0,5,0,0],"blurb":"You're a heroic, slightly vain legend who insists on statues of himself in every town. Under the fabulous hair is someone who does good deeds just because they're good.","flaw":"Your sculptors. You've commissioned a lot of statues.","item":"A sword and a very good hair routine","who":"The hero who led Frieren's party in Frieren: Beyond Journey's End, remembered everywhere for his kindness and his statues."},
  {"name":"Kagura","jp":"神楽","series":"Gintama","role":"S","type":"baka","g":"F","spot":"#ff5f4a","v":[5,3,0,0,5,1,1,3,2,0],"blurb":"You're a tiny, super-strong girl with a giant appetite and a mouth to match. You eat rice by the bucket, insult everyone, and fight for your found family.","flaw":"Vinegar kelp. You can't stop.","item":"A purple umbrella that doubles as a gun","who":"A super-strong alien girl in Gintama who works at Gintoki's odd-jobs business and eats an astonishing amount of rice."}
];

var CALIBRATION = {"any":[-0.128,-0.13,0.092,0.253,0.294,-0.064,0.16,0.248,0.045,-0.244,-0.143,-0.048,-0.083,-0.255,-0.006,0.037,0.157,-0.018,-0.038,0.185,-0.059,0.169,0.24,-0.066,-0.258,-0.216,0.282,-0.208,0.057,0.231,-0.287,0.015,0.117,-0.032,0.116,0.146,0.198,-0.31,0.01,0.139,0.058,-0.042,0.022,-0.098,-0.122,-0.003,-0.119,0.038,-0.2,-0.083,0.069,-0.188,0.153,-0.333,0.021,-0.382,-0.17,-0.422,-0.282,-0.36,-0.385,-0.24,-0.217,-0.172,-0.298,-0.242,-0.066,-0.148,-0.343,-0.245,0.161,-0.13,-0.237,-0.1,0.131,0.086,-0.09,-0.054,-0.06,0.18,-0.209,0.107,-0.168,-0.392,-0.086,0.14,0.079,-0.031,0.294,0.004,-0.074,0.21,-0.137,0.15,-0.279,-0.087,-0.232,-0.057,-0.437,0.05,-0.06,-0.071,-0.334,0.294,0.14,-0.056,-0.186,0.072,0.178,0.1,0.165,-0.049,-0.064,0.01,0.095,0.19,-0.299,0.07,-0.392,0.105,0.063,0.081,0.027,-0.388,-0.141,-0.028,-0.035,0.024,-0.029,0.031,-0.372,0.026,-0.29,0.077,-0.15,-0.091,-0.065,-0.134,-0.246,-0.112,0.003,-0.092,0.068,0.083,0.25,-0.095,-0.039,0.072,-0.001,0.104,0.049,-0.254,-0.197,-0.063,-0.272,0.035,-0.249,-0.191,0.11,0.08,0.125,-0.174,-0.035,0.066,0.077,0.105,-0.149,-0.015,-0.055],"M":[-0.102,-0.069,0.137,0,0,-0.073,0,0,0,-0.167,-0.146,0,-0.079,-0.284,0.037,0.071,0.221,0.04,-0.01,0.202,-0.057,0,0.281,-0.065,-0.222,-0.216,0.331,0,0,0,-0.327,0,0,0,0,0,0,0,0,0,0.096,-0.031,0,-0.061,0,0,-0.128,0,-0.109,0,0.116,-0.176,0.151,-0.378,0.015,-0.44,-0.21,-0.398,-0.32,-0.386,-0.391,-0.278,-0.25,-0.18,-0.318,-0.277,-0.1,-0.179,-0.338,-0.259,0,0,0,-0.108,0,0,0,-0.044,-0.071,0,-0.187,0.14,0,0,-0.105,0.192,0.162,0,0.353,0.028,0,0,-0.135,0.181,-0.323,-0.073,0,-0.016,-0.354,0.043,-0.039,-0.047,-0.228,0.382,0.154,-0.055,-0.19,0,0.217,0.117,0,0.01,-0.048,0.002,0,0,0,0.094,-0.381,0.187,0.153,0,0.005,0,0,0,0,0,0,0,0,0,0,0,-0.122,-0.046,0,0,0,0,0,0,0,0.106,0,-0.08,0,0.101,0,0.14,0.073,0,-0.204,-0.037,-0.299,0,-0.2,-0.183,0,0,0.22,0,-0.001,0,0,0,0,0.019,0],"F":[0,0,0,0.184,0.25,0,0.081,0.194,0.046,0,0,-0.053,0,0,0,0,0,0,0,0,0,0.15,0,0,0,0,0,-0.278,0.039,0.186,0,-0.09,0.024,-0.11,0.073,0.056,0.139,-0.316,-0.068,0.119,0,0,-0.059,0,-0.128,0.023,0,-0.036,0,-0.081,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.133,-0.034,-0.147,0,0.113,0.109,-0.032,0,0,0.136,0,0,-0.173,-0.411,0,0,0,0.007,0,0,-0.124,0.155,0,0,0,0,-0.283,0,0,0,0,0,0,0,0,0,0,0.065,0,0,0.084,-0.12,0,0,0.053,0.157,-0.364,0,0,0,0,0.066,0,-0.427,-0.219,-0.102,-0.14,0.031,-0.023,-0.006,-0.374,-0.081,-0.323,0.011,0,0,-0.079,-0.113,-0.199,-0.179,-0.014,-0.122,0.094,0,0.18,0,0.01,0,-0.022,0,0,-0.31,0,0,0,0.014,0,0,0.033,0.059,0,-0.244,0,0.02,0.06,0.106,-0.185,0,-0.143]};

var TRAITS = [
  ["g", "Guts"], ["h", "Heart"], ["b", "Brains"], ["c", "Cool"], ["x", "Chaos"],
  ["d", "Drive"], ["s", "Shadow"], ["e", "Spotlight"], ["t", "Tsun"], ["q", "Shy"]
];
var TKEYS = TRAITS.map(function (t) { return t[0]; });
var ROLES = { P: "Protagonist", V: "Villain", S: "Side character" };

/* Personality types. sky/scene/fx/emblem/orb/sfx drive the generated splash art. */
var TYPES = {
  tsun: { name: "Tsundere", jp: "ツンデレ", plural: "tsunderes",
    gist: "Sharp tongue, soft heart. You insult the people you like and protect them when nobody is looking.",
    love: "\"I-it's not like I made this for you! I just made too much.\"",
    ost: "An upbeat opening that suddenly turns into a piano ballad.",
    habitat: "An empty classroom at sunset, arms crossed, definitely not waiting for anyone.",
    sky: ["#ff8a5c", "#ffd9a8"], orb: "sun", scene: "room", fx: "petals", emblem: "crackheart", sfx: "フン!" },
  kuu: { name: "Kuudere", jp: "クーデレ", plural: "kuuderes",
    gist: "Calm, quiet and unreadable. Your affection shows up as one tiny smile per season.",
    love: "\"I don't mind if you stay.\" (This is a full confession.)",
    ost: "A solo violin over falling snow.",
    habitat: "A window seat in the library, after dark.",
    sky: ["#16233f", "#7a93c4"], orb: "moon", scene: "hills", fx: "snow", emblem: "snowflake", sfx: "シーン" },
  dan: { name: "Dandere", jp: "ダンデレ", plural: "danderes",
    gist: "Quiet because you're shy, not because you're cold. Get you talking about your thing and you never stop.",
    love: "A handwritten note, folded nine times, left in a locker.",
    ost: "Lo-fi beats and a cat purring.",
    habitat: "Behind a bookshelf, or in a closet with great acoustics.",
    sky: ["#9fb3ff", "#ffd6ea"], orb: "sun", scene: "city", fx: "petals", emblem: "book", sfx: "あわわ" },
  yan: { name: "Yandere", jp: "ヤンデレ", plural: "yanderes",
    gist: "Your love is a ten out of ten, and that's the problem. Sweet as candy, until someone gets too close to your person.",
    love: "\"We'll be together forever. I've already checked.\"",
    ost: "A music box that slowly goes out of tune.",
    habitat: "A rose garden with a very locked gate.",
    sky: ["#240818", "#b0304f"], orb: "moon", scene: "garden", fx: "hearts", emblem: "dripheart", sfx: "ずっと…" },
  dere: { name: "Deredere", jp: "デレデレ", plural: "deredere types",
    gist: "Openly, cheerfully affectionate. You hand out kindness like flyers and you never run out.",
    love: "\"I like you!\" Out loud. In public. Daily.",
    ost: "Bright acoustic guitar and handclaps.",
    habitat: "A sunny riverbank picnic for twelve.",
    sky: ["#ffa9c4", "#fff1c4"], orb: "sun", scene: "hills", fx: "hearts", emblem: "heart", sfx: "キラキラ" },
  hime: { name: "Himedere", jp: "姫デレ", plural: "himederes",
    gist: "You expect to be treated like royalty, and somehow people do. Under the crown, you really want someone to stay.",
    love: "\"You may escort me. Consider it an honour.\"",
    ost: "Harpsichord, trumpets and slightly too much reverb.",
    habitat: "A balcony. You're waving.",
    sky: ["#e7b2ff", "#ffe6a3"], orb: "sun", scene: "stage", fx: "sparkles", emblem: "crown", sfx: "オーッホッホ" },
  kami: { name: "Kamidere", jp: "神デレ", plural: "kamideres",
    gist: "You believe you're the main character of reality, and you're annoyingly convincing about it.",
    love: "\"I've decided you're mine. The universe agreed.\"",
    ost: "A full choir that starts the moment you enter.",
    habitat: "A throne you built yourself.",
    sky: ["#0d0a1f", "#5b3fa8"], orb: "eclipse", scene: "void", fx: "stars", emblem: "halo", sfx: "ゴゴゴゴ" },
  sado: { name: "Sadodere", jp: "サドデレ", plural: "teasers",
    gist: "You love teasing people until they turn red. Being flustered is their job. Watching is yours.",
    love: "\"Your face is red. Do you like me or something?\" (You like them.)",
    ost: "A jazzy bass line and finger snaps.",
    habitat: "Front row, chin in hand, grinning.",
    sky: ["#3a1240", "#ff6fae"], orb: "moon", scene: "stage", fx: "cards", emblem: "smirk", sfx: "ニヤ" },
  baka: { name: "Bakadere", jp: "バカデレ", plural: "bakaderes",
    gist: "Clumsy, loud and lovable. You trip over your own plans and land in the right place anyway.",
    love: "You tried to bake them a cake. The kitchen is gone. They loved it.",
    ost: "Kazoo, slide whistle and one triumphant cymbal.",
    habitat: "A food stall at the summer festival.",
    sky: ["#ffc94d", "#ff9f8f"], orb: "sun", scene: "festival", fx: "stars", emblem: "spiral", sfx: "てへっ" },
  daru: { name: "Darudere", jp: "ダルデレ", plural: "darudere types",
    gist: "Everything is a hassle. You will save the day, but only after a nap and a long sigh.",
    love: "\"...Fine. I'll walk you home. It's on the way.\" (It is not on the way.)",
    ost: "Rain on a window and a sleepy synth.",
    habitat: "Any flat surface in the sun.",
    sky: ["#8ccaf2", "#e8f5ff"], orb: "sun", scene: "clouds", fx: "zzz", emblem: "none", sfx: "ぐぅ…" },
  doro: { name: "Dorodere", jp: "ドロデレ", plural: "dorodere types",
    gist: "Sweet smile, perfect manners, and something deep and dark in the basement of your soul.",
    love: "\"Of course I love you. I love everything I own.\"",
    ost: "A gentle lullaby with a cello underneath that never resolves.",
    habitat: "A tea party nobody is allowed to leave.",
    sky: ["#17161f", "#665a7a"], orb: "eclipse", scene: "garden", fx: "petals", emblem: "mask", sfx: "ニコッ" },
  genki: { name: "Genki", jp: "元気", plural: "genki types",
    gist: "Pure sunshine with legs. You're awake, you're excited, and you've already made three new friends today.",
    love: "A tackle hug. No warning.",
    ost: "A J-pop opening at 180 BPM.",
    habitat: "The beach, the gym, anywhere with snacks.",
    sky: ["#4fc3ff", "#fff0a0"], orb: "sun", scene: "sea", fx: "sparkles", emblem: "sun", sfx: "ワーイ!" },
  nekketsu: { name: "Nekketsu", jp: "熱血", plural: "hot-blooded types",
    gist: "Hot-blooded and unbreakable. You shout your dream, you lose, you train, you come back louder.",
    love: "\"I'll protect you even if it kills me!\" At full volume.",
    ost: "Electric guitars and someone screaming a technique name.",
    habitat: "A training ground at dawn, mid push-up.",
    sky: ["#ff4d2e", "#ffc04d"], orb: "sun", scene: "flames", fx: "embers", emblem: "flame", sfx: "ドドド" },
  chuuni: { name: "Chuunibyou", jp: "中二病", plural: "chuunibyou types",
    gist: "You have a secret power, a tragic backstory and a cool pose, at least in your own head. Commitment is everything.",
    love: "\"Our fates were bound by a contract older than time.\" (You met on Tuesday.)",
    ost: "Gothic organ with a dubstep drop.",
    habitat: "A rooftop at midnight, wearing a cape.",
    sky: ["#120a2e", "#7a2fd0"], orb: "moon", scene: "city", fx: "stars", emblem: "circle", sfx: "フハハハ" },
  strat: { name: "Strategist", jp: "策士", plural: "strategists",
    gist: "You see the board, the pieces and the next twelve moves. Your idea of fun is a plan working perfectly.",
    love: "A colour-coded schedule for both of you, with contingency plans.",
    ost: "A ticking clock, piano, and a huge orchestral hit when the plan clicks.",
    habitat: "A desk covered in sticky notes and red string.",
    sky: ["#0d2830", "#3fa7a0"], orb: "none", scene: "void", fx: "stars", emblem: "target", sfx: "計画通り" },
  mentor: { name: "Mentor", jp: "師匠", plural: "mentors",
    gist: "You've seen it all. You're laid-back on the surface, and you'd move mountains for the people you're responsible for.",
    love: "Shows up exactly when you need them. Pretends it was a coincidence.",
    ost: "A bamboo flute and wind through the trees.",
    habitat: "Under an old tree beside a shrine gate.",
    sky: ["#ff9f5a", "#ffe3b8"], orb: "sun", scene: "shrine", fx: "leaves", emblem: "none", sfx: "フッ" },
  lone: { name: "Lone wolf", jp: "一匹狼", plural: "lone wolves",
    gist: "You work alone, you talk little, and you're somehow always there when it matters. The team is yours. You just won't say it.",
    love: "Leaves before you can say thank you. Comes back with your favourite drink.",
    ost: "One distorted guitar under a full moon.",
    habitat: "Leaning on a wall at the edge of every scene.",
    sky: ["#111827", "#4d6a8a"], orb: "moon", scene: "hills", fx: "wind", emblem: "blade", sfx: "…" }
};

function parseW(str) {
  var w = {};
  str.split(" ").forEach(function (p) { w[p[0]] = +p.slice(1); });
  return w;
}
SLOTS.forEach(function (slot) {
  slot.qs.forEach(function (q) {
    q.a = q.a.map(function (a) { return { t: a[0], w: parseW(a[1]), f: a[2] }; });
    if (q.lean && typeof q.lean === "string") q.lean = [q.lean];
  });
});

/* Pick which version of a chapter this player sees, from their answers so far. */
function pickQuestion(slot, tot, last, flags) {
  var qs = slot.qs, i;
  for (i = 0; i < qs.length; i++) if (qs[i].flag && flags[qs[i].flag]) return qs[i];
  var score = function (k) { return ((tot[k] || 0) + 2 * (last[k] || 0)) / NORM[k]; };
  var top = 0;
  TKEYS.forEach(function (k) { top = Math.max(top, score(k)); });
  var best = null, bs = 0;
  for (i = 0; i < qs.length; i++) {
    if (!qs[i].lean) continue;
    var s = Math.max.apply(null, qs[i].lean.map(score));
    if (s > bs) { bs = s; best = qs[i]; }
  }
  if (best && bs >= LEAN_CUT * top) return best;
  for (i = qs.length - 1; i >= 0; i--) if (!qs[i].flag && !qs[i].lean) return qs[i];
}
var LEAN_CUT = 0.62;
/* Some traits show up in more answers than others; scale them so every route gets a fair chance. */
var NORM = {};
(function () {
  var sum = {}, n = 0;
  TKEYS.forEach(function (k) { sum[k] = 0; });
  SLOTS.forEach(function (s) { s.qs.forEach(function (q) { q.a.forEach(function (a) {
    n++; Object.keys(a.w).forEach(function (k) { sum[k] += a.w[k]; });
  }); }); });
  TKEYS.forEach(function (k) { NORM[k] = sum[k] / n; });
})();

/* Walk the story for a list of picks. Returns the questions shown and the trait totals. */
function walk(picks, upto) {
  var tot = {}, last = {}, flags = {}, shown = [];
  TKEYS.forEach(function (k) { tot[k] = 0; });
  var n = upto == null ? picks.length : upto;
  for (var i = 0; i < SLOTS.length && i <= n; i++) {
    var q = pickQuestion(SLOTS[i], tot, last, flags);
    shown.push(q);
    if (i === n || picks[i] == null) break;
    var a = q.a[picks[i]];
    if (!a) break;
    last = a.w;
    Object.keys(a.w).forEach(function (k) { tot[k] += a.w[k]; });
    if (a.f) flags[a.f] = true;
  }
  return { shown: shown, tot: tot, profile: TKEYS.map(function (k) { return tot[k]; }) };
}

function correlation(a, b) {
  var n = a.length, ma = 0, mb = 0, i;
  for (i = 0; i < n; i++) { ma += a[i]; mb += b[i]; }
  ma /= n; mb /= n;
  var num = 0, da = 0, db = 0;
  for (i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb);
    da += (a[i] - ma) * (a[i] - ma);
    db += (b[i] - mb) * (b[i] - mb);
  }
  return da && db ? num / Math.sqrt(da * db) : 0;
}

var POOLS = {
  any: { label: "Anyone", test: function () { return true; } },
  M: { label: "Male characters", test: function (c) { return c.g !== "F"; } },
  F: { label: "Female characters", test: function (c) { return c.g !== "M"; } }
};
function rank(profile, pool) {
  pool = POOLS[pool] ? pool : "any";
  var cal = CALIBRATION[pool] || [];
  return CHARACTERS
    .map(function (c, i) { var r = correlation(profile, c.v); return { c: c, i: i, r: r, s: r - (cal[i] || 0) }; })
    .filter(function (o) { return POOLS[pool].test(o.c); })
    .sort(function (x, y) { return y.s - x.s || x.i - y.i; });
}
