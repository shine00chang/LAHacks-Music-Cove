<script>
  import { onMount } from 'svelte';
  import { Canvas, Text } from '$lib/blackbeard.js';
  const WIDTH = 200;
  const HEIGHT = 200;
  let canvas_element;
  let score = 0;
  let game_over = false;
  let score_text;

  export let emit;
  export let nickname;
  const onover = () => {
    if (game_over) return;
    game_over = true;
    // emit score
    const data = {
      event: 'score',
      game: 'flappy',
      author: nickname,
      score: score
    };
    console.log("flappy bird emitted: ", data);
    emit({}, data);
  } 
  /**
   * @param {Canvas} canvas
   */
  class FlappyBird {
    constructor(canvas) {
      this.canvas = canvas;
      this.x_coord = 15;
      this.y_coord = 150;
      //bird's width and height
      this.BIRD_DIM = 12;
      this.cooldown_frame = 0;
      this.canvas.components.push(this);
      this.canvas.addEvent("keydown", [this], false);
    }
    update() {
      if (game_over) return;
      //add one point every 6 frames
      if (this.canvas.frame%6 === 0) {
        score += 1;
        score_text.text = "Score: "+String(score);
      }
      this.y_coord += 1;
      this.canvas.context.fillStyle = "red";
      this.canvas.context.fillRect(this.x_coord, this.y_coord, this.BIRD_DIM, this.BIRD_DIM);
    }
    keydown(e) {
      //go up if space pressed
      if (e.key === " " || e.key === "ArrowUp") {
        this.cooldown_frame = this.canvas.frames += 3;
        this.y_coord -= 8;
      } else if (e.key === "ArrowDown") {
        this.cooldown_frame = this.canvas.frames += 3;
        this.y_coord += 8;
      }
    }
  }
  let bird;
  class Pipe {
    constructor(canvas, top_height, bottom_height) {
      this.canvas = canvas;
      this.top_height = top_height;
      this.bottom_height = bottom_height;
      this.current_x = 200;
      this.display = true;
      this.canvas.components.push(this);
    }
    update() {
      if (this.current_x < 0) {
        this.display = false;
      }
      if (!this.display) return;
      const PIPE_WIDTH = 10;
      if ((this.current_x > 15 && this.current_x < 30) || (this.current_x+PIPE_WIDTH > 15 && this.current_x+PIPE_WIDTH < 30)) {
        //check to see if bird goes through pipe
        if (bird.y_coord < this.top_height || bird.y_coord > HEIGHT-this.bottom_height || bird.y_coord+bird.BIRD_DIM < this.top_height || bird.y_coord+bird.BIRD_DIM > HEIGHT-this.bottom_height) {
          onover();
          let measure = canvas.context.measureText("GAM OVER");
          new Text(canvas, [100-measure.width/2, 100+24], "GAM OVER", "24px Arial", "black", false, 100, false)
        }
      }
      this.current_x -= 2;
      this.canvas.context.fillStyle = "green";
      this.canvas.context.fillRect(this.current_x, 0, 10, this.top_height);
      this.canvas.context.fillRect(this.current_x, WIDTH-this.bottom_height, PIPE_WIDTH, this.bottom_height);
    }
  }
  let canvas;
  onMount(() => {
    canvas_element.focus();
    function gen_pipe() {
      if (game_over) return;
      let top_height = Math.floor(Math.random()*150);
      let _pipe = new Pipe(canvas, top_height, HEIGHT-top_height-30);
      //2 to 4.5 seconds pipe generating
      setTimeout(gen_pipe, Math.floor(Math.random()*2500)+2000);
    }
    function start_game() {
      console.log("Starting flappy bird game");
      canvas = new Canvas(canvas_element);
      score_text = new Text(canvas, [160, 20], "Score: 0", "18px Arial", "black", false, 35, "flappy-score");
      bird = new FlappyBird(canvas);
      setInterval(function() {
        canvas.update();
      }, 1000/12);
      gen_pipe();
    }
    start_game();
  });
</script>

<div class="widget">
  <canvas bind:this={canvas_element} width={WIDTH} height={HEIGHT}></canvas>
</div>
