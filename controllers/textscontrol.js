const Text = require('../models/texts.model');

exports.getAll = (req, res) => {
  Text.find((err, result) => {
    if (err) throw err;
    res.send(result);
  });
};

exports.getText = (req, res) => {
  let index = req.params.id;
  Text.findById({_id: index}, (err, result) => {
    if (err) throw err;
    res.send(result);
  })
};

exports.addText = (req, res) => {
  let newText = new Text;

  newText.createdAt = Date.now();
  newText.author = req.session.passport ? req.session.passport.user._id : 'admin';
  newText.content = req.body.content;

  newText.save((err) => {
    if (err) throw err;
    res.send(newText);
  })
};

exports.updateText = (req, res) => {
  let newText = req.body.newtext;
  let index = req.params.id;
  let updateAt = Date.now();
  Text.findOneAndUpdate({_id: index}, {content: newText, updatedAt: updateAt}, (err, result) => {
    if (err) throw err;
    res.send(result);
  })
};

exports.deleteText = (req, res) => {
  let index = req.params.id;
  Text.findOneAndDelete({_id: index}, (err) => {
    if (err) throw err;
    res.sendStatus(200);
  })
};

