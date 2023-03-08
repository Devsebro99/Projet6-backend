const Sauce = require('../models/sauceModel');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
};

exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  delete sauceObjet._id;
  const sauce = new Sauce({
    ...sauceObjet,
    userId: req.auth.userId, likes: 0, dislikes: 0,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce crée !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.likeDislikeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;
  if (like === 1) {
    Sauce.updateOne({ _id: sauceId },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: userId },
        $pull: { usersDisliked: userId }
      })
      .then(() => res.status(200).json({ message: 'Like sauce modifiée !' }))
      .catch(error => res.status(400).json({ error }));
  } else {
    if (like === -1) {
      Sauce.updateOne({ _id: sauceId },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
          $pull: { usersLiked: userId }
        })
        .then(() => res.status(200).json({ message: 'Dislike sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
    } else {
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
            )
              .then(() => res.status(200).json({ message: 'Like retiré!' }))
              .catch(error => res.status(419).json({ error }));
          } else {
            if (sauce.usersDisliked.includes(userId)) {
              Sauce.updateOne(
                { _id: req.params.id },
                { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
              )
                .then(() => res.status(200).json({ message: 'DisLike retiré!' }))
                .catch(error => res.status(420).json({ error }));
            }
          }
        })
        .catch((error) => res.status(400).json({ error }))
    }
  }
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(Sauce => res.status(200).json(Sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.file) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { });
        const updatedSauce = { ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` };
        Sauce.updateOne({ _id: req.params.id }, { ...updatedSauce, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée1 !' }))
          .catch(error => res.status(400).json({ error }));
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
          .then(() => res.status(200).json({ message: `${req.imageUrl}` }))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
}


exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch(error => res.status(400).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

