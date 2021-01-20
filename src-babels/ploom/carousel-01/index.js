const execute = (list) => {
  console.log('Carousel01.execute - list', list);
};

const init = () => {
  const list = document.getElementsByClassName('carousel-option-01');
  if (list?.length > 0) {
    execute(list);
  }
};

const carousel01 = {
  init,
};

export default carousel01;
