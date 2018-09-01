const faker = require('faker');
const Text = require('../models/texts.model');

exports.addTexts = (number) => {
  for (let i = 0; i <= number; i++) {
    let newText = new Text;
    newText.createdAt = Date.now();
    newText.author = 'lorem';
    newText.content = faker.lorem.paragraph();
    newText.save((err) => {
      if (err) throw err;
      console.log('Text # ' + i + 'was added');
    })
  }
};