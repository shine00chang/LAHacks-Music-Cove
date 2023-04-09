export class Canvas {
  /**
   * @param {number[]} size
   * @param {string} id
   * @param {HTMLElement} parent
   */
  constructor(canvas_ele) {
    this.canvas = canvas_ele;
    this.canvas.id = canvas_ele.id;
    this.canvas.width = canvas_ele.width;
    this.canvas.height = canvas_ele.height;
    this.size = [this.canvas.width, this.canvas.width];
    this.canvas.tabIndex = 1;
    this.context = this.canvas.getContext('2d');
    this.components = [];
    this.events = {};
    //this.event_functions is not meant to be read. internal use only
    this.event_functions = {};
    this.frame = 0;
    this.click_temp_disabled = false;
  }
  update() {
    this.frame += 1;
    this.clear();
    for (let i=0; i < this.components.length; i++) {
      this.components[i].update();
    }
  }
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  reset() {
    this.components = [];
    document.body.style.cursor = "default";
    //dont forget to remove all event listeners
    for (let i=0; i < Object.keys(this.event_functions).length; i++) {
      let event = Object.keys(this.event_functions)[i];
      let event_function = this.event_functions[event];
      this.canvas.removeEventListener(event, event_function);
    }
    this.event_functions = {};
    this.events = {};
  }
  //new (name: string) => any means any class (eg TextButton)
  /**
   * @param {string} event
   * @param {[new (name: string) => any]} objects
   * @param {boolean} [overwrite=false]
   */
  addEvent(event, objects, overwrite=false) {
    //prevent overwriting
    if (this.events[event] && !overwrite) {
      this.events[event] = [].concat(this.events[event], objects);
    } else if (!this.events[event]) {
      this.events[event] = objects;
      //to make sure multiple event listeners arent added, only add the listener the first time addEvent() is called for event, after a reset/start. simplified; we only need one event listener per event, prevent there being multiple
      //add components to the event separately
      let self = this;
      function canvasEventHandler(e) {
        self.clearDeadEvents();
        let event_items = self.events[event];
        if (!event_items) {
          return;
        }
        for (let i=0; i < event_items.length; i++) {
          let component = event_items[i];
          component[event](e);
        }
        if (e.type === "contextmenu") {
          return false;
        }
      }
      this.canvas.addEventListener(event, canvasEventHandler);
      this.event_functions[event] = canvasEventHandler;
    } else {
      this.events[event] = objects;
    }
  }
  //when components no longer exist, get rid of the events for them too
  clearDeadEvents() {
    for (let i=0; i < Object.keys(this.events).length; i++) {
      let event_name = Object.keys(this.events)[i];
      for (let j=0; j < this.events[event_name].length; j++) {
        let obj = this.events[event_name][j];
        //if component no longer exists
        if (!this.components.includes(obj)) {
          this.events[event_name].splice(j, 1);
        }
      }
    }
  }
}
export class Text {
  /**
   * @param {Canvas} canvas
   * @param {number[]} coords
   * @param {string} text
   * @param {string} text_info
   * @param {string} color
   * @param {string} stroke_color
   * @param {number} maxwidth
   * @param {string} identity
   */
  constructor(canvas, coords, text, text_info, color, stroke_color, maxwidth, identity) {
    this.canvas = canvas;
    this.coords = coords;
    this.text = text;
    this.text_info = text_info;
    this.stroke_color = stroke_color;
    this.color = color;
    this.maxwidth = maxwidth;
    this.identity = identity;
    if (this.identity) {
      this.canvas.addEvent("customtextchange", [this], false);
      this.canvas.addEvent("customcoordschange", [this], false);
    }
    //this.display should be set from outside
    this.display = true;
    this.shadowBlur = 5;
    this.lineWidth = 10;
    this.canvas.components.push(this);
  }
  customtextchange(text_obj) {
    console.log(text_obj)
    //if it is "0" then we should let it happen
    if (text_obj.detail[this.identity] !== undefined && text_obj.detail[this.identity] !== false) {
      this.text = text_obj.detail[this.identity];
    }
  }
  customcoordschange(coords_obj) {
    //if text changes, coords may need to change too
    if (coords_obj.detail[this.identity]) {
      this.coords = coords_obj.detail[this.identity];
    }
  }
  update() {
    if (!this.display) {
      return;
    }
    if (this.text === undefined || this.text === false) {
      return;
    }
    this.canvas.context.font = this.text_info;
    //eg: shadow-white
    if (this.stroke_color) {
      if (this.stroke_color.startsWith('shadow-')) {
        if (window.settings.shadow) {
          this.canvas.context.shadowColor = this.stroke_color.split("-")[1];
          this.canvas.context.shadowBlur = this.shadowBlur;
          this.canvas.context.lineWidth = this.lineWidth;
        }
      } else {
        this.canvas.context.strokeStyle = this.stroke_color;
        this.canvas.context.strokeText(this.text, this.coords[0], this.coords[1], this.maxwidth);
      }
    }
    if (this.color) {
      this.canvas.context.fillStyle = this.color;
      if (this.maxwidth) {
        this.canvas.context.fillText(this.text, this.coords[0], this.coords[1], this.maxwidth);
      } else {
        this.canvas.context.fillText(this.text, this.coords[0], this.coords[1]);
      }
    }
    if (this.stroke_color) {
      if (this.stroke_color.startsWith('shadow-')) {
        //reset
        this.canvas.context.shadowBlur = 0;
        this.canvas.context.lineWidth = 1;
      }
    }
  }
}