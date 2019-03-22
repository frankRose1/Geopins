function first() {
  setTimeout(() => {
    console.log('First');
  }, 1000);
}

function second() {
  setTimeout(() => {
    console.log('Second');
  }, 1000);
}

function gt() {
  setTimeout(() => {
    console.log('gt');
  }, 1000);
}

const third = new Promise((res, rej) => {
  setTimeout(() => {
    return res('Third');
  }, 1000);
});

first();
second();
gt();
third.then(console.log);
