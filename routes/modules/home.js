const express = require('express');
const router = express.Router();

const show = function (req, res){
	res.render('home', {title: 'Platform'})
}

module.exports.show = show;

