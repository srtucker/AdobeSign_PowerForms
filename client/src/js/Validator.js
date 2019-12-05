
export default class Validator {
  constructor() {
    this._observers = {};
    this._trackers = {};

    this.nextTrackerId = 1;
  }

  createTracker(elm, validationFn) {
    let id = this.nextTrackerId++;
    let tracker = new ValidationTracker(id, elm, validationFn);
    for(var observerId in this._observers) {
      tracker.addObserver(observerId, this._observers[observerId]);
    }

    this._trackers[id] = tracker;

    return tracker;
  }

  addObserver(id, fn) {
    this._observers[id] = fn;
    for(var trackerId in this._trackers) {
      this._trackers[trackerId].addObserver(id, fn);
    }
  }

  createObserver(id) {
    let observer = new ValidationObserver(id);
    let fn = observer.getFn();
    this.addObserver(id, fn);
    return observer;
  }

  revalidateAll() {
    for(var trackerId in this._trackers) {
      this._trackers[trackerId].revalidate();
    }
  }
}

export class ValidationObserver {
  constructor(id) {
    this.id = id
    this.currentErrors = {};

    this._hook = function(){};
  }

  setHook(fn) {
    this._hook = fn;
  }

  getFn() {
    return this.observerFn.bind(this);
  }

  observerFn(id, errorFlag, message, elm) {
    //console.log({id, errorFlag, message, elm})
    if(errorFlag) {
      this.currentErrors[id] = {message, elm};
    }
    else {
      delete this.currentErrors[id];
    }

    this._hook(this.currentErrors);
  }
}

export class ValidationTracker {
  constructor(id, elm, validationFn) {
    this.id = id;
    this.elm = elm;
    this.validationFn = validationFn;
    this._error = false;
    this._message = null;
    this._observers = {};

    this._notifyObservers = function() {
      for(var id in this._observers) {
        this._observers[id](this.id, this._error, this._message, this.elm);
          /*error: this._error,
          message: this._message,
          id: this.id,
          elm: this.elm
        });*/
      }
    }
  }

  get error() {
    return this._error;
  }

  set error(newError) {
    if(newError !== this._error) {
      this._error = newError;
      this._notifyObservers();
    }
  }

  get message() {
    return this._message;
  }

  set message(newMessage) {
    if(newMessage !== this._message) {
      this._message = newMessage;
      this._notifyObservers();
    }
  }

  update(newError, newMessage) {
    //console.log({newError,oldError: this._error,newMessage,oldMessage: this._message});
    if(newError !== this._error || newMessage !== this._message) {
      this._error = newError;
      this._message = newMessage;

      this._notifyObservers();
    }
  }

  addObserver(id, fn) {
    this._observers[id] = fn;
  }

  removeObserver(id) {
    delete this._observers[id];
  }

  revalidate() {
    this.validationFn(this, null, true);
  }
}
