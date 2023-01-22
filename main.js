// ****************** // SIMPLE TETRIS GAME PURE JAVASCRIPT // **********************//

// ****************** // ARRAYS AND DATA // **********************//

// ALL PIECES LIST, this is not accurate piece list but it will work
const GAME_PIECES = [
	{
		color: &quot;#00AAEC&quot;,
		selection: [
			[[1, 1, 1, 1]],
			[[1], [1], [1], [1]],
			[[1, 1, 1, 1]],
			[[1], [1], [1], [1]],
		],
	},
	{
		color: &quot;#005EAA&quot;,
		selection: [
			[
				[1, 0, 0],
				[1, 1, 1],
			],
			[
				[1, 1],
				[1, 0],
				[1, 0],
			],
			[
				[1, 1, 1],
				[0, 0, 1],
			],
			[
				[0, 1],
				[0, 1],
				[1, 1],
			],
		],
	},
	{
		color: &quot;#E5A325&quot;,
		selection: [
			[
				[0, 0, 1],
				[1, 1, 1],
			],
			[
				[1, 0],
				[1, 0],
				[1, 1],
			],
			[
				[1, 1, 1],
				[1, 0, 0],
			],
			[
				[1, 1],
				[0, 1],
				[0, 1],
			],
		],
	},
	{
		color: &quot;#FFF355&quot;,
		selection: [
			[
				[1, 1],
				[1, 1],
			],
			[
				[1, 1],
				[1, 1],
			],
			[
				[1, 1],
				[1, 1],
			],
			[
				[1, 1],
				[1, 1],
			],
		],
	},
	{
		color: &quot;#52B848&quot;,
		selection: [
			[
				[0, 1, 1],
				[1, 1, 0],
			],
			[
				[1, 0],
				[1, 1],
				[0, 1],
			],
			[
				[0, 1, 1],
				[1, 1, 0],
			],
			[
				[1, 0],
				[1, 1],
				[0, 1],
			],
		],
	},
	{
		color: &quot;#9B3393&quot;,
		selection: [
			[
				[0, 1, 0],
				[1, 1, 1],
			],
			[
				[1, 0],
				[1, 1],
				[1, 0],
			],
			[
				[1, 1, 1],
				[0, 1, 0],
			],
			[
				[0, 1],
				[1, 1],
				[0, 1],
			],
		],
	},
	{
		color: &quot;#EC1A4F&quot;,
		selection: [
			[
				[1, 1, 0],
				[0, 1, 1],
			],
			[
				[0, 1],
				[1, 1],
				[1, 0],
			],
			[
				[1, 1, 0],
				[0, 1, 1],
			],
			[
				[0, 1],
				[1, 1],
				[1, 0],
			],
		],
	},
];

// Scoring Values
const GAME_SCORING = { 1: 40, 2: 100, 3: 300, 4: 1200 };

// Goals Values
const GAME_GOALS = {
	1: 10,
	2: 20,
	3: 30,
	4: 40,
	5: 50,
	6: 70,
	7: 90,
	8: 120,
	9: 130,
	10: 150,
};

// Game Key Bindings
const KEY_BINDINGS = {
	MOVE_LEFT: [&quot;ArrowLeft&quot;, &quot;KeyA&quot;],
	MOVE_RIGHT: [&quot;ArrowRight&quot;, &quot;KeyD&quot;],
	MOVE_DOWN: [&quot;ArrowDown&quot;, &quot;KeyS&quot;],
	NEXT_SELECTION: [&quot;ArrowUp&quot;, &quot;KeyW&quot;],
	PREV_SELECTION: [&quot;KeyV&quot;],
	HOLD: [&quot;KeyC&quot;, &quot;ShiftLeft&quot;],
	DROP: [&quot;Space&quot;, &quot;Click&quot;],
	PAUSE: [&quot;KeyP&quot;],
	START: [&quot;Enter&quot;],
};

// Storing all listener function for hover and click event
const LISTENER_STOCKS = [];

// ****************** // TETRIS // **********************//

// Main game
class Tetris {
	constructor(CANVAS, PLAYER) {
		PLAYER.GAME = this; // set game
		CANVAS.width = 600; // setup width
		CANVAS.height = 600; // setup height
		this.PLAYER = PLAYER; // set player
		this._SetDefault(); // set as default
	}

	_SetDefault() {
		// some ...
		this.INFORMATION = {
			winner: false,
			ended: false,
			started: false,
			paused: false,

			defaultTime: 1000,
			lvprl: 100,
		};

		this.DATA = {
			CTX: CANVAS.getContext(&quot;2d&quot;),
			CANVAS: CANVAS,
			CANVASINFO: {
				width: parseInt(getComputedStyle(CANVAS).width),
				height: parseInt(getComputedStyle(CANVAS).height),
			},
		};
	}

	_Init(callback) {
		this._Menu(); // create a front page menu
		callback &amp;&amp; callback.call(this); // use for some functions outside
	}

	_Pause() {
		let G = this;
		this.INFORMATION.started = true;
		this.INFORMATION.ended = false;
		this.INFORMATION.paused = true;
		this.INFORMATION.winner = false;

		// all buttons for Pause
		const BUTTONS = [
			// Continue  button
			{
				text: &quot;Continue&quot;,
				action: function () {
					// if game was not started, start otherwise resume the game
					if (G.INFORMATION.started) {
						G._Resume();
					} else {
						G._Start();
					}
				},
				style: { fill: &quot;#fff&quot;, radius: 6, color: &quot;#000&quot; },
				hover: { fill: &quot;#0084FF&quot;, stroke: false },
			},
			// Back to the menu
			{
				text: &quot;Back&quot;,
				action: function () {
					G._Reset(); // then reset the game
				},
				style: { fill: &quot;#fff&quot;, radius: 6, color: &quot;#000&quot; },
				hover: { fill: &quot;#0084FF&quot;, stroke: false },
			},
			// some  settings functionality
			{
				text: &quot;Settings&quot;,
				action: null,
				style: { fill: false, radius: 6, color: &quot;#000&quot; },
				hover: { fill: &quot;#0084FF&quot;, stroke: false },
			},
		];

		this._Popup(BUTTONS, &quot;Paused&quot;); // create a popup
	}

	_Menu() {
		let G = this;

		// all buttons for menu
		const BUTTONS = [
			// start button
			{
				text: &quot;Start&quot;,
				action: function () {
					G._Start();
				},
				style: { fill: &quot;#fff&quot;, radius: 6, color: &quot;#000&quot; },
				hover: { fill: &quot;#0084FF&quot;, stroke: false },
			},
			// some settings functionalty
			{
				text: &quot;Settings&quot;,
				action: null,
				style: { fill: false, radius: 6, color: &quot;#000&quot; },
				hover: { fill: &quot;#0084FF&quot;, stroke: false },
			},
		];

		this._Popup(BUTTONS, &quot;TETRIS&quot;); // create a popup
	}

	_Clear() {
		// just clear the whole canvas

		let width = this.DATA.CANVASINFO.width;
		let height = this.DATA.CANVASINFO.height;
		let ctx = this.DATA.CTX;

		ctx.clearRect(0, 0, width, height);
	}

	_Resume() {
		// then resume the game
		this.INFORMATION.started = true;
		this.INFORMATION.ended = false;
		this.INFORMATION.paused = false;
		this.INFORMATION.winner = false;

		this._ResetListener(); // remove all the listeners
	}

	_Stop() {
		// stop the game
		this.INFORMATION.started = false;
		this.INFORMATION.ended = true;
		this.INFORMATION.paused = false;
		this.INFORMATION.winner = false;
		this.PLAYER.INFORMATION.isStarted = false;
	}

	_Start() {
		// start the ga,e
		this.INFORMATION.started = true;
		this.INFORMATION.ended = false;
		this.INFORMATION.paused = false;
		this.INFORMATION.winner = false;
		this.PLAYER.INFORMATION.isStarted = true;

		this._ResetListener(); // reset and remove all old functions and listeners
		this.PLAYER._Init(); // create board and scoreboard
		this.PLAYER._Start(); // rende and update board
		this._Listener(); // add some listeners
	}

	_Reset() {
		this._Stop(); // stop the game
		this._SetDefault(); // set to default
		this.PLAYER._SetDefault(); // set all player data as default of it
		this._Init(); // create a menu
		this._Listener(); // add some listeners
	}

	_Ready() {
		// if the game was started
		if (this.INFORMATION.started) {
			// and also if the player alredy start the game
			if (this.PLAYER.INFORMATION.isStarted) {
				// if the game was not ended yet
				if (!this.INFORMATION.ended) {
					// if the game was not paused
					if (!this.INFORMATION.paused) {
						return true; // then return it is ready
					}
				}
			}
		}
	}

	_Listener() {
		let T = this; // the game
		let Player = this.PLAYER; // the player
		let Canvas = this.DATA.CANVAS; // the canvas

		addEventListener(&quot;keydown&quot;, function (event) {
			let key = event.code;
			let current = Player.PIECES.current;

			// if there is no current piece just return
			if (!current) return;

			switch (key) {
				// space
				case KEY_BINDINGS.DROP[0]:
				case KEY_BINDINGS.DROP[1]:
					// drop the current piece
					Player._Drop();
					break;
				// left
				case KEY_BINDINGS.MOVE_LEFT[0]:
				case KEY_BINDINGS.MOVE_LEFT[1]:
					// move to the left the current piece
					current._Move(0);
					break;
				// up
				case KEY_BINDINGS.NEXT_SELECTION[0]:
				case KEY_BINDINGS.NEXT_SELECTION[1]:
					// select next selection of piece
					current._Next();
					break;
				case KEY_BINDINGS.PREV_SELECTION[0]:
				case KEY_BINDINGS.PREV_SELECTION[1]:
					// select prev selection of piece
					current._Prev();
					break;
				// right
				case KEY_BINDINGS.MOVE_RIGHT[0]:
				case KEY_BINDINGS.MOVE_RIGHT[1]:
					// move to the right the current piece
					current._Move(1);
					break;
				// down
				case KEY_BINDINGS.MOVE_DOWN[0]:
				case KEY_BINDINGS.MOVE_DOWN[1]:
					// move down the current piece
					current._Move(2);
					break;
				case KEY_BINDINGS.HOLD[0]:
				case KEY_BINDINGS.HOLD[1]:
					// hold the current piece
					Player._Hold();
					break;
				case KEY_BINDINGS.PAUSE[0]:
				case KEY_BINDINGS.PAUSE[1]:
					// if the game was already paused
					// then just resume it
					if (T.INFORMATION.paused) {
						T._Resume();
					} else {
						T._Pause();
					}
					break;
				case KEY_BINDINGS.START[0]:
				case KEY_BINDINGS.START[1]:
					// start the game when it is trigger
					if (!T.INFORMATION.started) {
						T._Start();
					}

					break;
			}
		});

		// when the player leaves the page
		// pause the game
		addEventListener(&quot;blur&quot;, function () {
			if (T.INFORMATION.started) {
				T._Pause();
			}
		});

		// when the player is hovering the board
		// move it accoring to the mouse pos
		Canvas.addEventListener(&quot;mousemove&quot;, function (event) {
			if (!T._Ready()) return;
			let bound = this.getBoundingClientRect();
			let cy = parseInt(event.clientY - bound.y);
			let cx = parseInt(event.clientX - bound.x);
			let squares = T.PLAYER.DATA.SQUARES;
			let current = Player.PIECES.current;

			if (!current) return;

			squares.forEach((square) =&gt; {
				let width = square.INFORMATION.square.size;
				let height = square.INFORMATION.square.size;
				let x = square.INFORMATION.square.x;
				let y = square.INFORMATION.square.y;
				let r = x + width;
				let b = y + height;
				let sx = square.INFORMATION.grid.x;
				let csx = current.DATA.position.x;
				let dir = csx &lt; sx ? 1 : 0;
				let step = Math.abs(sx - csx);

				if (cx &gt; x &amp;&amp; cx &lt; r &amp;&amp; cy &gt; y &amp;&amp; cy &lt; b) {
					for (let i = 0; i &lt; step; i++) {
						current._Move(dir);
					}
				}
			});
		});

		// add some listener
		this._CEListener({
			x: this.PLAYER.BOARD.INFORMATION.margin.x,
			y: this.PLAYER.BOARD.INFORMATION.margin.y,
			width: this.PLAYER.BOARD.INFORMATION.width,
			height: this.PLAYER.BOARD.INFORMATION.height,
			click: function () {
				if (KEY_BINDINGS.DROP.includes(&quot;Click&quot;)) {
					PLAYER._Drop();
				}
			},
		});
	}

// ************************** TETRIS UTILS // ************************

	_ResetListener() {
		let G = this; // the game
		// loop trough all listeners
		LISTENER_STOCKS.forEach((fn) =&gt; {
			if (fn.HOVER &amp;&amp; typeof fn.HOVER == &quot;function&quot;) {
				G.DATA.CANVAS.removeEventListener(&quot;mousemove&quot;, fn.HOVER);
			}
			if (fn.CLICK &amp;&amp; typeof fn.CLICK == &quot;function&quot;) {
				G.DATA.CANVAS.removeEventListener(&quot;click&quot;, fn.CLICK);
			}
		});
	}

	_Popup(buttons, headline) {
		this._Clear();
		let G = this; // the game
		let width = this.DATA.CANVASINFO.width; // the whole width of canvas
		let height = this.DATA.CANVASINFO.height; // the canvas height
		let x = 25; // just margin
		let y = 25; // just margin
		let fill = &quot;#001D3F&quot;; // background
		let tm = { x: width / 2, y: (30 / 100) * height }; // text margin

		let parentW = (55 / 100) * width;
		let parentH = 200;
		let parentX = parentW / 2;
		let parentY = tm.y + parentH / 2;

		this._Rect(x, y, width, height, fill); // draw the background
		this._Text(headline, x + tm.x, y + tm.y, width, 54, true, &quot;#fff&quot;, true); // draw the main text

		// just create a parent division
		const createParent = function () {
			G._ResetListener(); // remove all listeners

			G.DATA.CTX.clearRect(parentX, parentY, parentW, parentH); // update only the parent
			G._Rect(parentX, parentY, parentW, parentH, &quot;#001D3F&quot;); // then draw again

			return { x: parentX, y: parentY, w: parentW, h: parentH };
		};

		// clearing round drawings
		const clearRoundRect = function (x, y, width, height, radius) {
			let ctx = G.DATA.CTX;
			ctx.save();
			ctx.beginPath();
			G._RoundRect(x, y, width, height, radius, false, false);
			ctx.clip();
			ctx.clearRect(x, y, width, height);
			ctx.restore();
		};

		// create button one b one
		const createButton = function (obj) {
			let { text, button, style, action, hover } = obj;
			let { width, height, x, y } = button;
			let { text: TEXT, x: tX, y: tY, size } = text;

			const create = function (style) {
				let { fill, stroke, color, radius } = style;
				clearRoundRect(x, y, width, height, radius);
				G._RoundRect(x, y, width, height, radius, fill, stroke);
				G._Text(TEXT, tX, tY, width, size, true, color, true);
			};

			// add some listeners on button
			let Listeners = G._CEListener({
				x,
				y,
				width,
				height,
				hover: function () {
					create(hover); // apply the value when it is hover
				},
				unhover: function () {
					create(style); // back to it&#39;s original styles
				},
				click: action &amp;&amp; typeof action == &quot;function&quot; ? action : false, // just a click event
			});

			LISTENER_STOCKS.push(Listeners); // then push the return value function of the listener

			create(style); // create first
		};

		// create bunch of buttons
		const createButtons = function () {
			let parent = createParent(); // create parent
			let mt = 20;
			let w = parent.w - mt * 2;
			let h = 40;
			let x = parent.x + mt;
			let y = parent.y + mt;

			for (let i = 0; i &lt; buttons.length; i++) {
				let b = buttons[i];
				let s = 18;
				let xx = w / 2;
				let yy = y + h - s + 5;
				// then create button
				createButton({
					button: { x, y, width: w, height: h },
					text: { text: b.text, x: x + xx, y: yy, size: s },
					style: b.style,
					action: b.action,
					hover: b.hover,
				});

				y += h + mt / 2;
			}
		};

		createButtons();
	}

	_CEListener(obj) {
		let { x, y, width, height, hover, unhover, click } = obj;
		let C = this;
		let canvas = this.DATA.CANVAS;
		let OBJECT = {
			HOVER: null,
			CLICK: null,
		};

		if (hover) {
			let HOVERED = false;

			const handle = function (event) {
				let bound = canvas.getBoundingClientRect();
				let cx = parseInt(event.clientX - bound.x);
				let cy = parseInt(event.clientY - bound.y);
				let r = x + width;
				let b = y + height;

				if (cx &gt; x &amp;&amp; cx &lt; r &amp;&amp; cy &gt; y &amp;&amp; cy &lt; b) {
					if (typeof hover == &quot;function&quot;) {
						hover.call(C);
						HOVERED = true;
						canvas.style.cursor = &quot;pointer&quot;;
					}
				} else if (HOVERED) {
					if (unhover &amp;&amp; typeof unhover == &quot;function&quot;) {
						unhover.call(C);
						canvas.style.cursor = &quot;default&quot;;
					}
					HOVERED = false;
				}
			};

			canvas.addEventListener(&quot;mousemove&quot;, handle);

			OBJECT.HOVER = handle;
		}

		if (click) {
			const handle = function (event) {
				let bound = canvas.getBoundingClientRect();
				let cx = parseInt(event.clientX - bound.x);
				let cy = parseInt(event.clientY - bound.y);
				let r = x + width;
				let b = y + height;

				if (cx &gt; x &amp;&amp; cx &lt; r &amp;&amp; cy &gt; y &amp;&amp; cy &lt; b) {
					if (typeof click == &quot;function&quot;) {
						click();
						canvas.style.cursor = &quot;default&quot;;
					}
				}
			};

			canvas.addEventListener(&quot;click&quot;, handle);
			OBJECT.CLICK = handle;
		}

		return OBJECT;
	}

	_Rect(x, y, w, h, f, b) {
		this.DATA.CTX.beginPath();
		this.DATA.CTX.strokeStyle = b ? b : &quot;transparent&quot;;
		this.DATA.CTX.fillStyle = f;
		this.DATA.CTX.rect(x, y, w, h);
		this.DATA.CTX.fill();
		this.DATA.CTX.stroke();
		this.DATA.CTX.closePath();
	}

	_RoundRect(x, y, width, height, radius, fill, stroke) {
		let ctx = this.DATA.CTX;

		if (typeof stroke === &quot;undefined&quot;) {
			stroke = true;
		}
		if (typeof radius === &quot;undefined&quot;) {
			radius = 5;
		}
		if (typeof radius === &quot;number&quot;) {
			radius = { tl: radius, tr: radius, br: radius, bl: radius };
		} else {
			var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
			for (var side in defaultRadius) {
				radius[side] = radius[side] || defaultRadius[side];
			}
		}
		ctx.fillStyle = fill ? fill : &quot;transparent&quot;;
		ctx.strokeStyle = stroke ? stroke : &quot;transparent&quot;;
		ctx.beginPath();
		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(
			x + width,
			y + height,
			x + width - radius.br,
			y + height
		);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		ctx.closePath();

		if (fill) {
			ctx.fill();
		}

		if (stroke) {
			ctx.stroke();
		}
	}

	_Text(text, x, y, maxWidth, size, bold, color, centerAlign) {
		let ctx = this.DATA.CTX;
		centerAlign ? (ctx.textAlign = &quot;center&quot;) : false;
		ctx.font = `${bold ? &quot;bold &quot; : &quot; &quot;} ${size ? size : 14}px  Comic Sans MS`;
		ctx.fillStyle = color ? color : &quot;#fff&quot;;
		ctx.fillText(text, x, y, maxWidth);
		ctx.textAlign = &quot;left&quot;;
	}

	_Find() {
		let Complete = []; // find all complete lines
		let Empty = []; // find all empty lines

		for (let i = this.PLAYER.DATA.GRID.length - 1; i &gt; 0; i--) {
			let filled = [];
			let notFilled = [];
			for (let j = this.PLAYER.DATA.GRID[i].length - 1; j &gt; 0; j--) {
				if (this.PLAYER.DATA.GRID[i][j]) {
					if (this.PLAYER.DATA.GRID[i][j].INFORMATION.block) {
						filled.push(this.PLAYER.DATA.GRID[i][j]);
					} else {
						notFilled.push(this.PLAYER.DATA.GRID[i][j]);
					}
				}
			}

			if (filled.length == this.PLAYER.DATA.GRID[i].length - 1) {
				Complete.push(i);

				// if all was already filled push it to completed
			}

			if (notFilled.length === this.PLAYER.DATA.GRID[i].length - 1) {
				Empty.push(i);

				// if all was empty push it to the empty array
			}
		}

		// then just filter
		for (let i = 0; i &lt; Complete.length; i++) {
			if (!this._isComplete(Complete[i])) {
				Complete.splice(i, 1);
			}
		}

		for (let i = 0; i &lt; Empty.length; i++) {
			if (!this._isEmpty(Empty[i])) {
				Empty.splice(i, 1);
			}
		}

		return { Complete, Empty };
	}
	
_isComplete(y) {
		// checking if the line y was complete or not
		let Filled = [];
		let GRID = this.PLAYER.DATA.GRID;
		if (!GRID[y]) return;
		for (let x = 0; x &lt; GRID[y].length; x++) {
			if (GRID[y][x] &amp;&amp; GRID[y][x].INFORMATION.block) {
				Filled.push(GRID[y][x]);
			}
		}

		if (Filled.length == GRID[y].length) {
			return true;
		}

		return false;
	}

	_isEmpty(y) {
		// checking if the line y was all empty
		let Filled = [];
		let GRID = this.PLAYER.DATA.GRID;
		if (!GRID[y]) return;
		for (let x = 0; x &lt; GRID[y].length; x++) {
			if (GRID[y][x] &amp;&amp; !GRID[y][x].INFORMATION.block) {
				Filled.push(GRID[y][x]);
			}
		}

		if (Filled.length == GRID[y].length) {
			return true;
		}

		return false;
	}

	_GetStartingPoint(bone) {
		// getting start position from it&#39;s original pos
		let startX = [];
		for (let i = 0; i &lt; bone.length; i++) {
			let xs = true;
			for (let j = 0; j &lt; bone[i].length; j++) {
				if (bone[i][j]) {
					if (xs) {
						startX.push(j);
						xs = false;
					}
				}
			}
		}

		return startX.sort()[0];
	}

	_GetEndingPointX(bone) {
		// get the  starting position
		let endX = [];
		for (let i = 0; i &lt; bone.length; i++) {
			let xs = true;
			for (let j = 0; j &lt; bone[i].length; j++) {
				if (bone[i][j]) {
					if (xs) {
						if (j == bone[i].length - 1) {
							endX.push(j);
							xs = false;
						}
					}
				}
			}
		}

		return endX.sort()[endX.length - 1] + 1;
	}

	_GetEndingPointY(bone) {
		// get the ending point of y
		let endY = bone.length - 1;
		for (let i = 0; i &lt; bone.length; i++) {
			let ys = [];
			for (let j = 0; j &lt; bone[i].length; j++) {
				if (!bone[i][j]) {
					ys.push(true);
				}
			}

			if (ys.length == bone[i].length) {
				endY--;
			}
		}

		return endY + 1;
	}

	_GetGridBone() {
		// just to know if you want to console log the table
		let BONE = [];
		for (let i = 0; i &lt; this.PLAYER.DATA.GRID.length; i++) {
			let arr = [];
			for (let j = 0; j &lt; this.PLAYER.DATA.GRID[i].length; j++) {
				arr.push(this.PLAYER.DATA.GRID[i][j].INFORMATION.block ? 1 : 0);
			}
			BONE.push(arr);
		}

		return BONE;
	}

	_CheckNext(index) {
		// check if the next is can move or not
		let player = this.PLAYER;
		let current = player.PIECES.current;
		let bone = current.DATA.selection[index];
		let x = current.DATA.position.x;
		let y = current.DATA.position.y;

		return this._Check(bone, x, y); // check if there was any conflict
	}

	_Check(BONE, x, y) {
		let player = this.PLAYER;
		let current = player.PIECES.current;
		let bone = BONE ? BONE : current.DATA.selected;

		return this._BoneCheck(bone, x, y); // check if there was any conflict on drawing the piece
	}

	_BoneCheck(bone, x, y) {
		let status = true;
		let startX = this._GetStartingPoint(bone);
		let endX = this._GetEndingPointX(bone) - 1;
		let endY = this._GetEndingPointY(bone) - 1;
		let Collision = this._PieceCollision(bone, x, y);

		// if the line was not exist in board
		if (!this.PLAYER.DATA.GRID[y]) {
			return false;
		}

		// if the piece reach the ground
		if (y + endY == this.PLAYER.DATA.GRID.length - 1) {
			status = true;
		}

		// if the right side plus it&#39;s width has no row or line
		if (!this.PLAYER.DATA.GRID[y][x + startX]) {
			status = false;
		}

		// if the left side plus it&#39;s starting position has no row or line
		if (!this.PLAYER.DATA.GRID[y][x + endX]) {
			status = false;
		}

		// if there is no line on the current postiion plus it&#39;s height
		if (!this.PLAYER.DATA.GRID[y + endY]) {
			status = false;
		}

		// if there is any collision
		if (Collision) {
			status = false;
		}

		return status;
	}

	_PieceCollision(bone, baseX, y) {
		// checking if the current piece is touching another piece
		for (let i = 0; i &lt; bone.length; i++, y++) {
			for (let j = 0, x = baseX; j &lt; bone[i].length; j++, x++) {
				if (
					bone[i][j] &amp;&amp;
					this.PLAYER.DATA.GRID[y] &amp;&amp;
					this.PLAYER.DATA.GRID[y][x]
				) {
					if (this.PLAYER.DATA.GRID[y][x].INFORMATION.block) {
						return { y, x, i: bone.length - i - 1, j };
					}
				}
			}
		}

		return false;
	}

	_RandomIndex = (max) =&gt; Math.floor(Math.random() * max); // just creating a random number base of the maximum num
}

// ****************** // PLAYER // **********************//

// a player
class Player {
	constructor(name) {
		this.GAME = null;

		this.INFORMATION = {
			name: name,
			isGameover: false,
			isPlaying: false,
			isStarted: false,
		};

		// set all to default
		this._SetDefault();
	}

	_SetDefault() {
		// some...
		if (this.DATA &amp;&amp; this.DATA.TIMER) {
			clearInterval(this.DATA.TIMER);
		}

		this.INFORMATION = {
			isGameover: false,
			isPlaying: false,
			isStarted: false,
		};

		this.DATA = {
			TIMER: null,
			GRID: [],
			SQUARES: [],
			PIECES: [],
			DROPED: [],
			score: 0,
			highScore: 0,
			goal: 10,
			lines: 0,
			level: 1,
			time: 1000,
		};

		this.PIECES = {
			next: [],
			hold: null,
			current: null,
			switched: false,
			combos: [],
			timestamp: 500,
		};

		this.BOARD = null;
		this.SCOREBOARD = null;
	}

	_Init() {
		// setup
		this.BOARD = new Board(this, GAME); // create new board
		this.SCOREBOARD = new ScoreBoard(this, GAME); // create new scoreboard
	}

	_Start() {
		// assign pieces first before go to the game
		this._Assign(function () {
			this.BOARD._Render(); // update the board
			this.SCOREBOARD._Update(); // update scoreboard
			this._Timer(); // thhen move the timer
		});
	}

	_Analyze() {
		let T = this;
		let G = this.GAME;
		let Completed = G._Find().Complete; // find all complete lines

		// just adjust
		const MoveBlock = function (square, toSquare) {
			toSquare.INFORMATION.block = square.INFORMATION.block;
			toSquare.INFORMATION.block.INFORMATION.position =
				toSquare.INFORMATION.grid;
			square.INFORMATION.block = false;
		};

		// adjust all lines when complete lines are remove
		const UpdateLines = function () {
			for (let y = T.DATA.GRID.length - 1; y &gt; 0; y--) {
				let yy = y;

				if (G._isEmpty(yy)) {
					while (G._isEmpty(yy - 1)) {
						yy -= 1;
					}

					if (T.DATA.GRID[yy - 1]) {
						for (let x = 0; x &lt; T.DATA.GRID[yy - 1].length; x++) {
							if (T.DATA.GRID[yy - 1][x]) {
								if (T.DATA.GRID[yy - 1][x].INFORMATION.block) {
									MoveBlock(T.DATA.GRID[yy - 1][x], T.DATA.GRID[y][x]);
								}
							}
						}
					}
				}
			}
		};

		// remove all complete  lines
		const RemoveLines = function () {
			for (let i = 0; i &lt; Completed.length; i++) {
				for (let x = 0; x &lt; T.DATA.GRID[Completed[i]].length; x++) {
					T.DATA.GRID[Completed[i]][x].INFORMATION.block = false;
				}
			}

			UpdateLines(); // update
		};

		const CheckWinner = function () {
			if (T.DATA.level == GAME_GOALS.length - 1) {
				if (T.DATA.lines &gt;= GAME_GOALS[GAME_GOALS.length - 1]) {
					console.log(&quot;WINNER&quot;);
					T._Win();
				}
			}
		};

		// check if the player reach the goal
		const CheckGoal = function () {
			let current = GAME_GOALS[T.DATA.level];

			// if it istrue then the player comes to the next level
			const LevelUp = function () {
				let Minus = G.INFORMATION.lvprl * T.DATA.level;
				T.DATA.level += 1;
				T.DATA.goal = GAME_GOALS[T.DATA.level];
				T.DATA.time = G.INFORMATION.defaultTime - Minus;

				CheckWinner();
			};

			T.DATA.lines &gt;= current &amp;&amp; LevelUp();
		};

		// add an highscore
		const AddhighScore = function () {
			let score = T.DATA.score;

			if (score &gt; T.DATA.highScore) {
				T.DATA.highScore = score;
			}
		};

		const AddScore = function () {
			T.DATA.score += GAME_SCORING[Completed.length] * T.DATA.level;

			AddhighScore();
		};

		const AddLines = function () {
			T.DATA.lines += Completed.length;
		};

		// just call if there was an completed lines
		if (Completed.length) {
			RemoveLines();
			AddLines();
			AddScore();
			CheckGoal();
		}
	}

	_Assign(callback) {
		let T = this;
		let pieces = GAME_PIECES; // all the pieces

		// create new piece
		const NewPiece = function () {
			return new Piece(pieces[T.GAME._RandomIndex(pieces.length)], T, T.GAME);
		};

		// create a bunch of next piece
		const CreateNextSet = function (from, until) {
			for (let i = from; i &lt; until; i++) T.PIECES.next[i] = NewPiece();
		};

		setTimeout(function () {
			if (!T.PIECES.next.length) {
				T.PIECES.current = NewPiece();
				CreateNextSet(0, 3);
			} else {
				T.PIECES.current = T.PIECES.next[0];
				T.PIECES.next[0] = T.PIECES.next[1];
				CreateNextSet(1, 3);
			}

			T.PIECES.switched = false;

			T._Update();

			callback &amp;&amp; callback.call(T);
		}, 100);
	}

	_Hold() {
		// store or hold the current piece
		if (this.PIECES.switched) return;

		if (!this.PIECES.hold) {
			let Current = this.PIECES.current;
			this.PIECES.hold = Current;

			this._Assign();

			this.PIECES.current.position = Current.position;
			this.PIECES.switched = true;
		} else {
			let Hold = this.PIECES.hold;
			this.PIECES.hold = this.PIECES.current;
			this.PIECES.current = Hold;
		}

		this.PIECES.switched = true;

		this._Update();
	}

	_Drop() {
		// drop the current piece
		if (!this.GAME._Ready()) return;

		let current = this.PIECES.current;

		if (!current) return;

		let target = current.DATA.target;

		current.DATA.position.y = target.y;
		current.DATA.position.x = target.x;
		current._Fill(target.y, target.x);

		this.PIECES.current = false;

		this._Assign();
		this._Analyze();
	}

	_Update() {
		this.SCOREBOARD._Update(); // update the scoreboard
	}

	_Timer() {
		let T = this;
		let Time = T.DATA.time;
		// every (Time) the current piece will move downward
		const TIMER = function (Time) {
			let timer = setInterval(function () {
				if (!T.PIECES.current) return;
				if (!T.GAME._Ready()) return;

				T.PIECES.current._Move(2);

				if (T.DATA.time != Time) {
					clearInterval(timer);
					TIMER(T.DATA.time);
				}
			}, Time);
			T.DATA.TIMER = timer;
		};

		TIMER(Time);
	}
	
_Piece(bone, baseX, baseY, color, subColor, stroke, current, iog, size) {
		// draw the piece according to the player settings
		let G = this;
		let GG = this.GAME.PLAYER.DATA.GRID;
		let BM = this.BOARD.INFORMATION.margin;
		let w = size ? size : this.BOARD.INFORMATION.size;
		let h = size ? size : this.BOARD.INFORMATION.size;
		let hw = w / 2;
		let hh = h / 2;

		let GameOver = false;

		const createPiece = function (x, y, width, height, color, stroke, sub) {
			G.GAME._Rect(x, y, width, height, color, stroke);

			let ww = x + Math.sqrt(width) + (10 / 100) * hw;
			let yy = y + Math.sqrt(height) + (10 / 100) * hh;

			G.GAME._Rect(ww, yy, hw, hh, subColor, false);
		};

		for (let i = 0, y = baseY; i &lt; bone.length; i++, y++) {
			for (let j = 0, x = baseX; j &lt; bone[i].length; j++, x++) {
				if (current &amp;&amp; GG[y] &amp;&amp; GG[y][x] &amp;&amp; GG[y][x].INFORMATION.block) {
					if (y &lt; 4) GameOver = true;
				}

				if (bone[i][j]) {
					let xx = iog ? baseX + j * w : x * w + BM.x;
					let yy = iog ? baseY + i * h : y * h + BM.y;

					createPiece(xx, yy, w, h, color, stroke, subColor, iog);
				}
			}
		}

		if (GameOver) this._GameOver();
	}

	_GameOver() {
		// the player is loose
		let G = this.GAME;
		G._Clear();
		G._Stop();
		G._Popup(
			[
				{
					text: &quot;Play again&quot;,
					action: function () {
						// if game was not started, start otherwise resume the game
						G._Reset();
						G._Start();
					},
					style: { fill: &quot;#fff&quot;, radius: 6, color: &quot;#000&quot; },
					hover: { fill: &quot;#0084FF&quot;, stroke: false },
				},
				{
					text: &quot;Back&quot;,
					action: function () {
						// if game was not started, start otherwise resume the game
						G._Reset();
					},
					style: { fill: &quot;#fff&quot;, radius: 6, color: &quot;#000&quot; },
					hover: { fill: &quot;#0084FF&quot;, stroke: false },
				},
			],
			&quot;You loose&quot;
		);
	}

	_Win() {
		let G = this.GAME;
		G._Popup(
			[
				{
					text: &quot;Play again&quot;,
					action: function () {
						// if game was not started, start otherwise resume the game
						G._Reset();
						G._Start();
					},
					style: { fill: &quot;#fff&quot;, radius: 6, color: &quot;#000&quot; },
					hover: { fill: &quot;#0084FF&quot;, stroke: false },
				},
				{
					text: &quot;Back&quot;,
					action: function () {
						// if game was not started, start otherwise resume the game
						G._Reset();
					},
					style: { fill: &quot;#fff&quot;, radius: 6, color: &quot;#000&quot; },
					hover: { fill: &quot;#0084FF&quot;, stroke: false },
				},
			],
			&quot;WINNER&quot;
		);
	}
}

// ****************** // PIECE // **********************//

class Piece {
	constructor(obj, player, game) {
		let { color, selection } = obj;
		let index = game._RandomIndex(selection.length);

		this.GAME = game;
		this.PLAYER = player;

		this.INFORMATION = {
			color,
			sub: &quot;rgba(0,0,0,0.20)&quot;,
			border: &quot;#fff&quot;,
		};

		this.DATA = {
			selection,
			selectedIndex: index,
			selected: selection[index],
			position: { x: null, y: null },
			length: { x: null, y: null },
			target: { x: null, y: null },
			isDropped: false,
		};

		this._GetLen(); // get it&#39;s len
		this._GetPosition(); // get the random position in the board
	}

	_GetLen() {
		this.DATA.length = {
			x: this.GAME._GetEndingPointX(this.DATA.selected),
			y: this.GAME._GetEndingPointY(this.DATA.selected),
		};
	}

	_GetPosition() {
		let Max = this.PLAYER.BOARD.INFORMATION.row;
		let index = this.GAME._RandomIndex(Max);
		while (!this.GAME._BoneCheck(this.DATA.selected, index, 0)) {
			index = this.GAME._RandomIndex(Max);
		}
		this.DATA.position.y = 0;
		this.DATA.position.x = index;
	}

	_Next() {
		if (!this.GAME._Ready()) return;

		let DATA = this.DATA;
		let index;

		if (DATA.selectedIndex == DATA.selection.length - 1) {
			index = 0;
		} else {
			index = DATA.selectedIndex + 1;
		}

		if (!this.GAME._CheckNext(index)) {
			return;
		}

		this.DATA.selected = this.DATA.selection[index];
		this.DATA.selectedIndex = index;

		this._GetLen();
	}

	_Prev() {
		if (!this.GAME._Ready()) return;

		let DATA = this.DATA;
		let index;

		if (DATA.selectedIndex == 0) {
			index = DATA.selection.length - 1;
		} else {
			index = DATA.selectedIndex - 1;
		}

		if (!this.GAME._CheckNext(index)) {
			return;
		}

		this.DATA.selected = this.DATA.selection[index];
		this.DATA.selectedIndex = index;

		this._GetLen();
	}

	_Move(dir) {
		if (!this.GAME._Ready()) return;

		let x = this.DATA.position.x;
		let y = this.DATA.position.y;
		let P = this.PLAYER;

		switch (dir) {
			case 0:
				x--;
				break;
			case 1:
				x++;
				break;

			case 2:
				y++;
				break;
			default:
				y++;
				break;
		}

		if (!this.GAME._Check(false, x, y)) {
			return dir == 2 ? P._Drop() : false;
		}

		this.DATA.position.x = x;
		this.DATA.position.y = y;

		this._GetLen();
	}

	_Draw(BOOL) {
		let bone = this.DATA.selected;
		let baseX = this.DATA.position.x;
		let baseY = this.DATA.position.y;
		let color = this.INFORMATION.color;
		let subColor = this.INFORMATION.sub;
		let stroke = this.INFORMATION.border;

		this.PLAYER._Piece(bone, baseX, baseY, color, subColor, stroke, BOOL);

		this._Shadow(); // draw a shadow
	}

	_Shadow() {
		if (this.DATA.isDropped) return;
		let piece = this;
		let BM = this.PLAYER.BOARD.INFORMATION.margin;
		let x = this.DATA.position.x;
		let y = this.DATA.position.y;
		let w = this.PLAYER.BOARD.INFORMATION.size;
		let h = this.PLAYER.BOARD.INFORMATION.size;
		let ground = this.GAME.PLAYER.DATA.GRID.length;
		let length = this.DATA.length;
		let selected = this.DATA.selected;
		let Collision = this.GAME._PieceCollision(selected, x, h);

		LOOP: for (let h = y; h &lt; ground; h++) {
			Collision = this.GAME._PieceCollision(selected, x, h + 1);
			if (Collision) break LOOP;
		}

		const Draw = function (ny, nx) {
			search: for (let i = 0, y = ny; i &lt; selected.length; i++, y++) {
				for (let j = 0, x = nx; j &lt; selected[i].length; j++, x++) {
					if (y &gt; piece.GAME.PLAYER.DATA.GRID.length - 1) {
						ny -= 1;
						break search;
					}
				}
			}

			for (let i = 0, y = ny; i &lt; selected.length; i++, y++) {
				for (let j = 0, x = nx; j &lt; selected[i].length; j++, x++) {
					if (selected[i][j]) {
						piece.GAME._Rect(
							x * w + BM.x,
							y * h + BM.y,
							w,
							h,
							&quot;transparent&quot;,
							&quot;#fff&quot;
						);
					}
				}
			}

			piece.DATA.target = { x: nx, y: ny };
		};

		if (!Collision) {
			Draw(ground - length.y, x);
		} else {
			Draw(Collision.y - length.y + Collision.i, x);
		}
	}

	_Fill(ny, nx) {
		let selected = this.DATA.selected;
		let GRID = this.PLAYER.DATA.GRID;
		for (let i = 0, y = ny; i &lt; selected.length; i++, y++) {
			for (let j = 0, x = nx; j &lt; selected[i].length; j++, x++) {
				if (selected[i][j] &amp;&amp; GRID[y] &amp;&amp; GRID[y][x]) {
					let position = { x, y };
					let color = this.INFORMATION.color;
					let sub = this.INFORMATION.sub;
					let colors = { color, sub };
					let block = new Block({ position, colors }, this.PLAYER, this.GAME);

					this.PLAYER.DATA.GRID[y][x].INFORMATION.block = block;
				}
			}
		}

		this.DATA.isDropped = true;
	}
}

// ****************** // BLOCK // **********************//

class Block {
	constructor(obj, player, GAME) {
		let { position, colors } = obj;

		this.GAME = GAME;
		this.PLAYER = player;
		this.DATA = GAME.DATA;

		this.INFORMATION = {
			position,
			color: colors.color,
			sub: colors.sub,
			stroke: &quot;#fff&quot;,
		};

		this._Draw();
	}

	_Draw() {
		let bone = [[1]];
		let x = this.INFORMATION.position.x;
		let y = this.INFORMATION.position.y;
		let color = this.INFORMATION.color;
		let subColor = this.INFORMATION.sub;
		let stroke = this.INFORMATION.stroke;

		this.PLAYER._Piece(bone, x, y, color, subColor, stroke, false);
	}
}

// ****************** // BOARD // **********************//

class Board {
	constructor(PLAYER, GAME) {
		this.INFORMATION = {
			col: 20,
			row: 10,
			size: null,
			width: 260,
			height: &quot;auto&quot;,
			margin: { x: 25, y: 25 },
		};

		this.PLAYER = PLAYER;
		this.GAME = GAME;
		this.DATA = GAME.DATA;

		this._Create();
	}

	_Create() {
		let col = this.INFORMATION.col;
		let row = this.INFORMATION.row;
		let margin = this.INFORMATION.margin;
		let width = this.INFORMATION.width;
		let size = width / row;
		let height = size * col;

		this.INFORMATION.size = size;
		this.INFORMATION.height = height;

		for (let i = 0; i &lt; col; i++) {
			let squaresArray = [];
			for (let j = 0; j &lt; row; j++) {
				let index = col * i + j;
				let x = size * j + margin.x;
				let y = size * i + margin.y;
				let obj = { index, grid: { y: i, x: j }, square: { x, y, size } };
				let square = new Square(obj, this.GAME);

				squaresArray.push(square);

				this.PLAYER.DATA.SQUARES.push(square);

				square._Draw();
			}

			this.PLAYER.DATA.GRID.push(squaresArray);
		}
	}

	_Update() {
		this.PLAYER.DATA.SQUARES.forEach((square) =&gt; square._Draw());
		if (!this.PLAYER.PIECES.current) return;
		this.PLAYER.PIECES.current._Draw(true);
	}

	_Render() {
		requestAnimationFrame(this._Render.bind(this));

		if (this.GAME._Ready()) {
			this.GAME._Clear();
			this._Update();
			this.PLAYER._Update();
		}
	}
}

// ****************** // SQUARE // **********************//
class Square {
	constructor(obj, GAME) {
		let { index, grid, square } = obj;

		this.INFORMATION = {
			index,
			grid,
			square,
			block: false,
		};

		this.GAME = GAME;
		this.DATA = GAME.DATA;
	}

	_Draw() {
		let background = true;
		let border = false;
		let x = this.INFORMATION.square.x;
		let y = this.INFORMATION.square.y;
		let size = this.INFORMATION.square.size;

		this.GAME._Rect(
			x,
			y,
			size,
			size,
			background ? &quot;#001D3F&quot; : &quot;transparent&quot;,
			border ? &quot;#1E1F20&quot; : &quot;transparent&quot;
		);

		this.INFORMATION.block &amp;&amp; this.INFORMATION.block._Draw();
	}
}

// ****************** // SCOREBOARD // **********************//

class ScoreBoard {
	constructor(PLAYER, GAME) {
		let BOARD = PLAYER.BOARD.INFORMATION;
		let baseX = BOARD.width + BOARD.margin.x * 2;
		let baseY = BOARD.margin.y;
		let width = 270;
		let height = BOARD.height;
		let margin = 10;
		this.ELEMENTS = {
			parent: {
				w: width,
				h: height,
				m: { x: 0, y: 0 },
				x: baseX,
				y: baseY,
				f: &quot;#001D3F&quot;,
				b: &quot;#fff&quot;,

				// 001D3F
			},
			top: {
				w: width,
				h: height / 3,
				m: { x: margin, y: margin },
				x: baseX,
				y: baseY,
				f: &quot;transparent&quot;,
				b: &quot;#fff&quot;,
			},
			bot: {
				w: width,
				h: height - height / 3,
				m: { x: margin, y: margin },
				x: baseX,
				y: 20 + height / 3,
				f: &quot;transparent&quot;,
				b: &quot;#fff&quot;,
			},
			next: {
				w: 180,
				h: 170,
				m: { x: margin * 2, y: margin * 2 },
				x: baseX + 5,
				y: baseY,
				f: &quot;transparent&quot;,
				b: &quot;transparent&quot;,
			},
			nextOfNext: {
				w: 100,
				h: 100,
				m: { x: margin * 2, y: margin * 2 },
				x: baseX + 165,
				y: baseY,
				f: &quot;transparent&quot;,
				b: &quot;transparent&quot;,
			},
			hold: {
				w: 100,
				h: 100,
				m: { x: 20, y: 20 },
				x: baseX + 165,
				y: baseY + 100 - 15 * 2,
				f: &quot;transparent&quot;,
				b: &quot;transparent&quot;,
			},
		};

		this.PLAYER = PLAYER;
		this.GAME = GAME;
	}

	_Update() {
		let S = this;
		let P = this.PLAYER;
		let PP = this.PLAYER.PIECES;

		const createPiece = function (i, c, size) {
			if (!c) return;
			let s = size ? size : P.BOARD.INFORMATION.size;
			let ii = c.INFORMATION;
			let d = c.DATA;
			let len = d.length;

			let ts = s * 2;
			let td = s / 2;
			let lx = s * len.x;
			let ly = s * len.y;
			let w = len.x == 1 ? ts + td : len.x == 2 ? lx : lx / len.x;
			let h = len.y == 1 ? ts + td : len.y == 2 ? ly : ly / len.y;

			let x = i.x + i.m.x / 2;
			let y = i.y + i.m.y / 2;

			P._Piece(
				d.selected,
				x + w,
				y + h,
				ii.color,
				ii.sub,
				ii.border,
				false,
				true,
				size
			);
		};

		const createText = function (i, text, maxWidth, size, bold, color) {
			S.GAME._Text(
				text,
				i.x + i.m.x * 2,
				i.y + size * 2 - 2,
				maxWidth,
				size,
				bold,
				color
			);
		};

		const Gen = function (i, a) {
			S.GAME._Rect(
				i.x + i.m.x,
				i.y + i.m.y,
				i.w - i.m.x * 2,
				i.h - i.m.y * 2,
				i.f,
				i.b
			);

			if (a == &quot;next&quot;) {
				createPiece(i, PP.next[0]);
			} else if (a == &quot;nextOfNext&quot;) {
				createPiece(i, PP.next[1], 13);
			} else if (a == &quot;hold&quot;) {
				if (PP.hold) {
					createPiece(i, PP.hold, 13);
				} else {
					createText(i, &quot;C&quot;, i.w, 32, true);
				}
			}
		};

		const CreateTexts = function (Arr) {
			Arr.forEach((arr, index) =&gt; {
				S.GAME._Text(
					`${arr[0]}: ${arr[1]}`,
					S.ELEMENTS.bot.x + S.ELEMENTS.bot.w / 2,
					S.ELEMENTS.top.h + 100 + 50 * index,
					S.ELEMENTS.bot.w,
					24,
					true,
					false,
					true
				);
			});
		};

		Object.entries(this.ELEMENTS).forEach((element) =&gt;
			Gen(element[1], element[0])
		);

		CreateTexts([
			[&quot;Score&quot;, P.DATA.score],
			[&quot;High Score&quot;, P.DATA.highScore],
			[&quot;Lines&quot;, P.DATA.lines],
			[&quot;Level&quot;, P.DATA.level],
		]);
	}
}

// ****************** START // **********************//

const CANVAS = document.getElementById(&quot;GAME&quot;);
const PLAYER = new Player(&quot;Orlan&quot;);
const GAME = new Tetris(CANVAS, PLAYER);

GAME._Init();
