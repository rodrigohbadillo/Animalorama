var GameState = {
    preload:function(){//Cargamos el json de la configuracion de los animales
      this.load.text('animals','assets/data/data.json'); },
	create:function(){
       
        this.animalData = JSON.parse(this.cache.getText('animals'));
        console.log(this.animalData);
		//scaling options
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	//have the game centered horizontally
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;
	    //screen size will be set automatically
   		this.scale.setScreenSize(true);
   		//create a sprite for the background
    	this.background = this.game.add.sprite(0, 0, 'background');

        //Generamos los animales de manera aleatoria a utilizar
        var arrayFiguresAndAnimals = this.generaMemorama(this.animalData.animals);
        var animalToFind = arrayFiguresAndAnimals[this.getRandomInt(0,8)].key;
        
        var randomUniqueColors = [];
        var int_ =0;
        while(int_<10){
            var tempValue = this.getRandomInt(0,10);
            if(randomUniqueColors.indexOf(tempValue)==-1){
                //No existe
                randomUniqueColors.push(tempValue);
                int_++;
            }
        }
        
        this.cards = this.game.add.group();
        this.animals = this.game.add.group();
        var self = this;
        var card;
        var animal;
        var counter = 0;
        var arrayPosicionesParaAnimales = [];
        var cardGlobal;
        var animalGlobal;
        this.animalData.figures.forEach(function(element){
            //console.log("ESTO "+this.animalData.animals[arrayFiguresAndAnimals[counter].id].key);
            //Se crea tarjeta
            card = self.cards.create(element.x,element.y,element.key+"_"+element.color[randomUniqueColors[counter]].value,0);
            animal = self.animals.create(element.x,element.y,this.animalData.animals[arrayFiguresAndAnimals[counter].id].key,0);
            animal.scale.setTo(0.4,0.4); //Se escala a una cuarta
            animal.anchor.setTo(0.5); //Mantiene en el centro la figura
            //animal.anchor.setTo(0.5,0.5);
            //animal.visible = false;
            animal.alpha = 0;
            arrayPosicionesParaAnimales.push({posX:element.x,posY:element.y});
            card.customParams = {animal:animal,color:element.key,audio:self.game.add.audio(this.animalData.colors[randomUniqueColors[counter]].key),toFind:animalToFind};
            
            //console.log("Este es el sonido "+this.animalData.colors[randomUniqueColors[counter]].key);
            card.anchor.setTo(0.5);
            //Implementar una animacion aqui
            card.inputEnabled = true;
            card.input.pixelPerfectClick = true;
            card.events.onInputDown.add(self.animateFigure,self);
            counter++;
        },this);
        console.log("Posiciones "+arrayPosicionesParaAnimales);
        //Dibujamos el animal a pintar, esto se cambiara con las letras
        var style = { font: '20px Arial', fill: '#fff'};
        this.game.add.text(400, 20, 'Animal to find: '+animalToFind, style);
        
        //this.animals = this.game.add.group();
        //var selfAnimal = this;
        //var animal;
        //var counterAnimal = 0;
        /*this.animalData.animals.forEach(function(element){
            animal = selfAnimal.animals.create(arrayPosicionesParaAnimales[counterAnimal].posX,arrayPosicionesParaAnimales[counterAnimal].posY)
            counterAnimal++;
        },this);*/
        
        /*arrayFiguresAndAnimals.forEach(function(element){
            animal = selfAnimal.animals.create(arrayPosicionesParaAnimales[counterAnimal].posX,arrayPosicionesParaAnimales[counterAnimal].posY,this.animalData.animals[element.id].key);
            //card.anchor.setTo(0.000001,0.000001);
            counterAnimal++;
        },this);
        */
        
        //var arrayPartidas = [];
        //var memorama;
        //numero de partidas definidas en el json
        //var numero_partidas = this.animalData.number_stages;
    	//for (var i = 0; i < numero_partidas; i++) {
            //En este arreglo se guardan los animales a utilizar en este juego
        //    memorama = this.agregaAtributoFigura(this.generaMemorama(this.animalData.animals));
        //    arrayPartidas.push(memorama);
        //};
        
        //Creamos un grupo donde se guardaran cada una de las partidas con sus respectivos memoramas ya cargados
        //this.stages = this.game.add.group();
        //var self = this;
        //var stage;

        //arrayPartidas.forEach(function(element){
        //    stage = self.stages.create();
        //},this);

        //pintamos las figuras
	},
	update:function(){},

    //generamos el Memorama a partir del arreglo de los 21 animales
    generaMemorama:function(animalData){
        var memorama = [];
        //Arreglo de posiciones a tomar, se tomaran 9 elementos sin repetir
        var posicionesATomar = this.randomNumbers21(); //El arreglo contiene 9 numeros sin repetir
        console.log(posicionesATomar);
        for (var i =0; i < posicionesATomar.length; i++) {
            for (var j = 0; j < animalData.length; j++) {
                if(animalData[j].id == posicionesATomar[i]){
                    memorama.push(animalData[j]);
                    break;
                }
            };
        };
        return memorama;
    },

	//Genera 9 numeros sin repetirse del 0 al 20
	randomNumbers21:function(){
		var unicos = chance.unique(chance.natural,9,{min:0,max:20});
		return unicos;
	},

    //Genera un elemento aleatorio desde un minimo a un maximo
    getRandomInt:function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //Se encarga de animar cada una de las tarjetas
    animateFigure: function(card,event){
        cardGlobal = card;
        animalGlobal = card.customParams.animal;
        card.customParams.audio.play();
        var millisecondsToWait = 1000;
        
        if(card.customParams.animal.key == card.customParams.toFind){
            console.log("Encontrado");
            console.log("Ganaste :D");

            game.time.events.add(Phaser.Timer.SECOND * 2, this.fadeImage, this);
            game.time.events.add(Phaser.Timer.SECOND * 2, this.showAnimal, this);
            game.time.events.add(Phaser.Timer.SECOND * 10, this.youWin, this);
            
        }else{
            console.log("no es");
            game.time.events.add(Phaser.Timer.SECOND * 1, this.fadeImage, this);
            game.time.events.add(Phaser.Timer.SECOND * 1, this.showAnimal, this);
            game.time.events.add(Phaser.Timer.SECOND * 4, this.badCard, this);   
        }
    },
    fadeImage: function(){
        console.log(cardGlobal);
        game.add.tween(cardGlobal).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

    },
    showAnimal: function(){
        console.log("Le animal"+animalGlobal);
        game.add.tween(animalGlobal).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
       
    },
    badCard: function(){
        game.add.tween(cardGlobal).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        game.add.tween(animalGlobal).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
    },
    youWin: function(){
        alert('Ganaste :D');
        game.state.start('GameState');
    }
};

//var game = new Phaser.Game(640, 360, Phaser.AUTO);
//game.state.add('GameState', GameState);
//game.state.start('GameState');