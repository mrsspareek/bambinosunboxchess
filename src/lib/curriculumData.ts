import { SessionPlan } from '../types/chess';

export const BEGINNER_CURRICULUM: SessionPlan[] = [
  {
    sessionNumber: 1,
    title: "Meet the Board & Meet the Army",
    section: "CONCEPT CLASS",
    primaryTool: "Bambinos Platform & Interactive Board",
    topics: ["Board Setup & Coordinates (Ranks 1-8, Files a-h)", "Meet the Army & Piece Values (P=1, N/B=3, R=5, Q=9, K=∞)"],
    coreConcept: "Mastering board orientation, coordinate system, piece starting squares, and material point values.",
    kidExplanation: "The board is a 64-square grid where every square has a letter and a number. Your army consists of 16 pieces, each with a specific starting square and material point value.",
    analogy: "It's like a movie theater seating grid combined with a trading card game — every seat has a coordinate (e4), and every character has a power score!",
    outcomeA: "Solves 5 coordinate spotting and piece value matching puzzles.",
    outcomeB: "Sets up a full board correctly from memory and explains all 6 piece values within 2 minutes.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Introduce 64-square grid and piece army. Ask: 'Why do Queen and Rook have higher point values than Pawns?'" },
      { step: "2", title: "Guided Practice (10m)", description: "Coach walks through rank/file coordinates (a1-h8) and starting squares for all 6 piece types. Demonstrates 1 guided coordinate puzzle." },
      { step: "3", title: "Main Practice / Bot (25m)", description: "Students complete 1 guided coordinate puzzle and 2 achievable piece-value matching challenges on the platform." },
      { step: "4", title: "Showcase & Review (5m)", description: "Screen-share fastest correct board setups, review piece values, and award 'Army Commander' badge." }
    ]
  },
  {
    sessionNumber: 2,
    title: "Board & Army Gameplay Masterclass",
    section: "GAME & REINFORCEMENT CLASS",
    primaryTool: "Bambinos Platform & AI Bot (Level 1)",
    topics: ["Review: Square Coordinates & Piece Values", "Game Application: 25-Minute Platform Game vs AI Bot"],
    coreConcept: "Applying board coordinates and piece values in a 3-puzzle challenge followed by a 25-minute full game vs Bambinos AI Bot.",
    kidExplanation: "Use your coordinate skills and piece value knowledge to play your first complete game against our Bambinos AI Bot!",
    analogy: "It's game day! Test your setup and piece values against our friendly AI Bot on the Bambinos platform!",
    outcomeA: "Solves 3 graduated puzzles (Easy: coordinate match, Medium: piece value trade, Hard: setup race).",
    outcomeB: "Plays 1 full 25-minute game against Bambinos AI Bot Level 1 with 100% legal moves.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Brief 3-minute recap of coordinates and piece values. Ask: 'Who can execute their opening setup faster than the AI Bot?'" },
      { step: "2", title: "Guided Practice (10m)", description: "Coach leads Puzzle 1 step-by-step. Show how to verify file letter before rank number." },
      { step: "3", title: "Main Practice (25m)", description: "Students solve Puzzle 2 & 3, then play 1 full 25-minute game against Bambinos AI Bot Level 1." },
      { step: "4", title: "Showcase & Review (5m)", description: "Screen-share AI Bot match scores, review legal move execution, and award 'Bot Game Pioneer' badge." }
    ]
  },
  {
    sessionNumber: 3,
    title: "The Linear Movers: Rook & Bishop",
    section: "CONCEPT CLASS",
    primaryTool: "Bambinos Platform & Interactive Board",
    topics: ["How the Rook Moves & Captures (Ranks & Files)", "How the Bishop Moves & Captures (Diagonals & Color-Bound Rule)"],
    coreConcept: "Distinguishing straight-line movement from diagonal movement and understanding why Bishops stay on one square color forever.",
    kidExplanation: "Rooks move straight along ranks and files (+ shape); Bishops move diagonally along same-color squares (X shape).",
    analogy: "Rooks are like laser beams going straight up/down/left/right; Bishops are like skis sliding down snow slopes of one color!",
    outcomeA: "Solves 4 Rook straight-line and Bishop color-bound maze puzzles.",
    outcomeB: "Moves Rook and Bishop legally across the board without leaving their valid paths.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Show Rook straight movement vs Bishop diagonal movement animations. Ask: 'Can a light-squared Bishop ever capture a piece on a dark square?'" },
      { step: "2", title: "Guided Practice (10m)", description: "Coach demonstrates Rook straight paths and Bishop color-bound diagonal mazes step-by-step." },
      { step: "3", title: "Main Practice (25m)", description: "Students solve 1 guided Rook maze puzzle and 2 achievable Bishop target-clearing exercises." },
      { step: "4", title: "Showcase & Review (5m)", description: "Review color-bound rules, highlight clean diagonal paths, and award 'Linear Navigator' badge." }
    ]
  },
  {
    sessionNumber: 4,
    title: "Rook & Bishop Gameplay Masterclass",
    section: "GAME & REINFORCEMENT CLASS",
    primaryTool: "Bambinos Platform & AI Bot (Level 1)",
    topics: ["Review: Rook & Bishop Line Mobility", "Game Application: 25-Minute Game vs AI Bot"],
    coreConcept: "Applying long-range Rook and Bishop lines in a 3-puzzle drill followed by a 25-minute full game vs Bambinos AI Bot.",
    kidExplanation: "Use open files for Rooks and open diagonals for Bishops to control key squares during your AI Bot game!",
    analogy: "Rooks and Bishops are highway trucks — drive them on clear open roads to control the board!",
    outcomeA: "Solves 3 graduated linear puzzles (Easy: Rook capture, Medium: Bishop trap, Hard: dual-line maze).",
    outcomeB: "Plays 1 full 25-minute game against Bambinos AI Bot Level 1 activating Rooks and Bishops.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Review open lines vs blocked lines. Ask: 'How do you unblock your Bishop's diagonal in the opening?'" },
      { step: "2", title: "Guided Practice (10m)", description: "Coach leads Puzzle 1. Show how to scan the full rank before moving." },
      { step: "3", title: "Main Practice (25m)", description: "Students complete Puzzle 2 & 3, then play 1 full 25-minute game vs Bambinos AI Bot Level 1." },
      { step: "4", title: "Showcase & Review (5m)", description: "Review AI Bot games, showcase long-range Rook captures, and award 'Long Range Gunner' badge." }
    ]
  },
  {
    sessionNumber: 5,
    title: "The Heavy Hitters: Queen & King",
    section: "CONCEPT CLASS",
    primaryTool: "Bambinos Platform & Interactive Board",
    topics: ["How Queen Moves (Rook + Bishop Combined)", "How King Moves & Royal Protection (1 Square Any Direction)"],
    coreConcept: "Understanding the most powerful piece on the board (Queen) and the most critical piece (King).",
    kidExplanation: "The Queen combines Rook and Bishop powers in all 8 directions; the King moves 1 square in any direction and must be protected at all costs.",
    analogy: "The Queen is the superhero captain flying in all 8 directions; the King is the VIP commander who takes 1 careful step at a time!",
    outcomeA: "Solves 4 Queen maze and King safety obstacle puzzles.",
    outcomeB: "Moves Queen and King legally while maintaining royal safety boundaries.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Demonstrate Queen sweeping power vs King 1-step walk. Ask: 'Why is the King worth infinite points?'" },
      { step: "2", title: "Guided Practice (10m)", description: "Coach walks through Queen multi-direction captures and King safety 1-square walk step-by-step." },
      { step: "3", title: "Main Practice (25m)", description: "Students solve 1 guided Queen sweeping maze and 2 achievable King obstacle clearance puzzles." },
      { step: "4", title: "Showcase & Review (5m)", description: "Review King safety rules, celebrate accurate Queen moves, and award 'Royal Shield' badge." }
    ]
  },
  {
    sessionNumber: 7,
    title: "Milestone 1 Welcome Tournament",
    section: "IN-CLASS TOURNAMENT SESSION",
    primaryTool: "Bambinos Tournament Platform",
    topics: ["Competitive Match Discipline", "Clock Management & Sportsmanship"],
    coreConcept: "Applying piece movement rules, board setup, and legal play in a structured 3-round tournament environment.",
    kidExplanation: "Tournaments test legal piece movement, focus, and respectful competition under clock conditions.",
    analogy: "A chess tournament is like a friendly sports tournament — play your best, respect your opponent, shake hands!",
    outcomeA: "Completes 3 rounds of timed mini-chess matches on the platform.",
    outcomeB: "Records game results and demonstrates proper chess sportsmanship.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Welcome students to Tournament 1. Explain 3-round pairing system, 7-minute clock rules, and sportsmanship etiquette." },
      { step: "2", title: "Guided Practice (10m)", description: "Coach reviews tournament dashboard, verifies pairing setups, and launches Round 1." },
      { step: "3", title: "Main Practice (25m)", description: "Students compete in 3 live paired rounds against classmates on the Bambinos tournament platform." },
      { step: "4", title: "Showcase & Review (5m)", description: "Display leaderboard, celebrate all participants, analyze 1 highlight move, and award 'Tournament Pioneer' medals." }
    ]
  },
  {
    sessionNumber: 10,
    title: "Check! Defending the King & CPR Rules",
    section: "CONCEPT CLASS",
    primaryTool: "Bambinos Platform & Interactive Board",
    topics: ["Definition of Check (King under direct attack)", "The 3 CPR Defense Rules (Capture, Protect/Block, Run)"],
    coreConcept: "Recognizing when the King is attacked and applying the 3 mandatory legal defensive responses.",
    kidExplanation: "Check means the King is attacked. You MUST get out of check immediately using CPR: Capture attacker, Protect/Block with a piece, or Run away.",
    analogy: "Check is a red emergency alarm! CPR is your 3-step emergency plan: C = Capture attacker, P = Protect with a shield, R = Run away!",
    outcomeA: "Solves 4 spot-the-check and CPR defense decision puzzles.",
    outcomeB: "Identifies check instantly and applies the correct CPR defense on the board.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Demonstrate King under attack alarm. Ask: 'Can you ignore check and capture another piece? Why not?'" },
      { step: "2", title: "Guided Practice (10m)", description: "Coach walks through the CPR formula step-by-step: C (Capture), P (Protect/Block), R (Run)." },
      { step: "3", title: "Main Practice (25m)", description: "Students solve 1 guided check-spotting puzzle and 2 achievable CPR defense exercises." },
      { step: "4", title: "Showcase & Review (5m)", description: "Review CPR steps, check student defensive choices, and award 'CPR Lifesaver' badge." }
    ]
  },
  {
    sessionNumber: 19,
    title: "Tactical Motif: The Knight Fork",
    section: "CONCEPT CLASS",
    primaryTool: "Bambinos Platform & Interactive Board",
    topics: ["Definition of a Fork (One piece attacking two targets)", "The Royal Knight Fork (Attacking King & Queen Simultaneously)"],
    coreConcept: "Using the Knight's jumping ability to attack two valuable enemy pieces at the same time.",
    kidExplanation: "A Knight Fork happens when one Knight lands on a square that attacks TWO enemy pieces at the same time!",
    analogy: "A Knight Fork is a double-pronged fork picking up two snacks at once — the opponent can only save one!",
    outcomeA: "Solves 4 Knight fork spotting puzzles.",
    outcomeB: "Executes a Royal Knight Fork (checking King while attacking Queen) on the board.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Demonstrate Knight Fork geometry. Ask: 'Why is a Knight Fork on the King and Queen the most devastating move in chess?'" },
      { step: "2", title: "Guided Practice (10m)", description: "Coach walks through finding fork target squares ('Look for two enemy pieces 1 Knight-hop away')." },
      { step: "3", title: "Main Practice (25m)", description: "Students solve 1 guided Knight fork puzzle and 2 achievable royal fork exercises." },
      { step: "4", title: "Showcase & Review (5m)", description: "Review fork target patterns, celebrate royal forks, and award 'Fork Hunter' badge." }
    ]
  },
  {
    sessionNumber: 36,
    title: "Opening Trick 1: Scholar's Mate Trap & Defense",
    section: "OPENING & TRICKS MASTERCLASS",
    primaryTool: "Bambinos Platform & Interactive Board",
    topics: ["Scholar's Mate Attack (1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6 4.Qxf7#)", "Principled Defense (3...g6! & 4...Nf6 Deflecting Queen)"],
    coreConcept: "Understanding the famous 4-move checkmate attack against f7 and mastering the rock-solid defense against early Queen raids.",
    kidExplanation: "Scholar's Mate attacks weak f7 square with Queen & Bishop. Defend by blocking with 3...g6! and developing 4...Nf6!",
    analogy: "Scholar's Mate is a surprise sprint attack — put up the 3...g6 pawn shield, and the early Queen gets trapped and forced to run away!",
    outcomeA: "Solves 4 Scholar's Mate defense and punishment puzzles.",
    outcomeB: "Demonstrates defending against 1.e4 e5 2.Qh5 with 2...Nc6 and 3...g6 with 100% accuracy.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Demonstrate 4-move Scholar's Mate sequence. Ask: 'Why is the f7 square so vulnerable early in the game?'" },
      { step: "2", title: "Guided Practice (10m)", description: "Coach walks through the exact 3-step defense: 1) Protect e5 pawn, 2) Block Queen line (3...g6!), 3) Kick Queen & develop (4...Nf6!)." },
      { step: "3", title: "Main Practice (25m)", description: "Students solve 2 guided Scholar's attack spotting puzzles and 2 achievable Scholar's defense exercises." },
      { step: "4", title: "Showcase & Review (5m)", description: "Review opening rule: 'Punish early Queen raids by developing minor pieces!', and award 'Scholar Shield' badge." }
    ]
  },
  {
    sessionNumber: 48,
    title: "Grand Capstone Unbox Chess Championship",
    section: "IN-CLASS TOURNAMENT SESSION",
    primaryTool: "Bambinos Tournament Platform",
    topics: ["Full Cumulative Mastery Showcase", "4-Round Clock Championship & Graduation"],
    coreConcept: "Demonstrating cumulative 48-session chess mastery across opening tricks, tactical motifs, endgames, and tournament play.",
    kidExplanation: "The Grand Capstone Championship brings together all 48 sessions of learning in a 4-round competitive tournament with clocks and live leaderboard!",
    analogy: "Welcome to the Grand Capstone Championship — play with focus, execute your tactics, and celebrate your graduation as an Unbox Chess Champion!",
    outcomeA: "Completes 4 rounds of competitive championship tournament play.",
    outcomeB: "Demonstrates cumulative skills (opening development, tactics, endgames) and receives Graduation Certificate.",
    lessonSteps: [
      { step: "1", title: "Hook & Concept (10m)", description: "Welcome students to the Grand Capstone Championship! Explain 4-round Swiss tournament format and 10-minute clock rules." },
      { step: "2", title: "Guided Practice (10m)", description: "Coach launches Round 1-4, tracks live standings on the main leaderboard, and provides commentary." },
      { step: "3", title: "Main Practice (25m)", description: "Students compete in 4 live paired rounds against classmates on the Bambinos tournament platform." },
      { step: "4", title: "Showcase & Review (5m)", description: "Present Grand Leaderboard, present Unbox Chess Graduation Certificates, and award 'Grand Champion' trophies!" }
    ]
  }
];
