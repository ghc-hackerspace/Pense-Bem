DummyMode = {
	reset: function() {},
	oneLoopIteration: function() {},
	buttonPress: function() {},
	buttonRelease: function() {},
};
AdvinheONumeroMode = DummyMode;
AdicaoMode = DummyMode;
MultiplicacaoMode = DummyMode;
DivisaoMode = DummyMode;
AritmeticaMode = DummyMode;
OperacaoMode = DummyMode;
SigaMeMode = DummyMode;
MemoriaSonsMode = DummyMode;
SubtracaoMode = DummyMode;
NumeroDoMeioMode = DummyMode;

LivroMode = {
	StateChoosingBook: 0,
	StateQuestioning: 1,
	reset: function() {
		LivroMode.state = LivroMode.StateChoosingBook;
	},
	oneLoopIteration: function() {
		switch (LivroMode.state) {
		case LivroMode.StateChoosingBook:
			var book = prompt("Book number?", "_");
			book = parseInt(book.substring(0, 2));
			alert("Selected book: " + book);
			if (book > 0 && book < 999) {
				LivroMode.book = book;
				LivroMode.question = 0;
				LivroMode.tries = 0;
				LivroMode.points = 0;
				LivroMode.state = LivroMode.StateQuestioning;

				LivroMode.advanceQuestion();
			}
			break;
		case LivroMode.StateQuestioning:
		}
	},
	showCorrectAnswer: function() {
		alert("The correct answer was: " + LivroMode.getCorrectAnswer());
	},
	advanceQuestion: function() {
		if (LivroMode.question >= 0) {
			switch (LivroMode.tries) {
			case 0: LivroMode.points += 10; break;
			case 1: LivroMode.points += 6; break;
			case 2: LivroMode.points += 4; break;
			}
		}
		LivroMode.tries = 0;
		LivroMode.question++;
		alert("Answer the question number " + LivroMode.question);
	},
	getCorrectAnswer: function() {
		const answerPattern = "CDDBAADCBDAADCBB";
		return answerPattern[(LivroMode.book + LivroMode.question) & 15];		
	},
	buttonPress: function(b) {
		switch (LivroMode.state) {
		case LivroMode.StateChoosingBook:
			break;
		case LivroMode.StateQuestioning:
			switch (b) {
			case "A":
			case "B":
			case "C":
			case "D":
				if (LivroMode.getCorrectAnswer(b) == b) {
					LivroMode.advanceQuestion();
					return;
				}
				LivroMode.tries++;
				if (LivroMode.tries >= 3) {
					LivroMode.showCorrectAnswer();
					LivroMode.advanceQuestion();
				} else {
					alert("Wrong! " + (3 - LivroMode.tries) + " more tries");
				}
				break;
			default:
				PB.beep();
			}
			break;
		}
	},
	buttonRelease: function(b) {		
	}
}

WelcomeMode = {
	reset: function() {},
	oneLoopIteration: function() {},
	buttonPress: function(b) {
		const buttonToModeTable = {
			"ADVINHE-O-NÚMERO": AdvinheONumeroMode,
			"ADIÇÃO": AdicaoMode,
			"MULTIPLICAÇÃO": MultiplicacaoMode,
			"DIVISÃO": DivisaoMode,
			"ARITMETICA": AritmeticaMode,
			"OPERAÇÃO": OperacaoMode,
			"SIGA-ME": SigaMeMode,
			"MEMÓRIA-SONS": MemoriaSonsMode,
			"NÚMERO-DO-MEIO": NumeroDoMeioMode,
			"SUBTRAÇÃO": SubtracaoMode,
			"LIVRO": LivroMode,
		};
		var newMode = buttonToModeTable[b];
		if (newMode === undefined) {
			PB.beep();
			return;
		}
		PB.setMode(newMode);
	},
	buttonRelease: function(b) {}
};

StandbyMode = {
	reset: function() {},
	oneLoopInteration: function() {},
	buttonPress: function(b) {},
	buttonRelease: function(b) {}
};

PB = {
	mode: null,
	init: function() {
		PB.reset();
		PB.setMode(StandbyMode);
		setInterval('PB.oneLoopIteration()', 100);
	},
	reset: function() {
		if (PB.mode) {
			PB.mode.reset();
		}
	},
	oneLoopIteration: function() {
		if (PB.mode) {
			PB.mode.oneLoopIteration();
		}
	},
	setMode: function(m) {
		PB.mode = m;
		PB.reset();
	},
	buttonPress: function(b) {
		switch (b) {
		case 'LIGA': PB.setMode(WelcomeMode); return;
		case 'DESL': PB.setMode(StandbyMode); return;
		default:
			if (PB.mode) {
				PB.mode.buttonPress(b);
			}
		}
	},
	buttonRelease: function(b) {
		if (b == 'LIGA' || b == 'DESL') {
			return;
		}
		if (PB.mode) {
			PB.mode.buttonRelease(b);
		}
	},
	beep: function() {
		alert("Ação inválida");
	}
};