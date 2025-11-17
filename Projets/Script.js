window.onload = function()
{   
    let canvaswidth = 900;
    let canvasheight = 600;
    let blocksize = 30;
    let Mon_serpent;
    let ctx;
    let delay = 100;
    let pommer;
    let widthblock = canvaswidth/blocksize;
    let heightblock = canvasheight/blocksize;
    let score;

    init();
    /* fonction pou kreye canvas lan epi initialize serpent an  */
    function init()
    {
        canvas = document.createElement("canvas");
        canvas.width = canvaswidth;
        canvas.height = canvasheight;
        canvas.style.border = "10px solid";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#f0f4";
        document.body.appendChild(canvas);
        ctx = canvas.getContext("2d");
        Mon_serpent = new snake([[6,4], [5,4], [4,4]], "right");
        pommer = new pomme([20, 10]);
        score = 0;
        refrech_canvas()
    };

    function refrech_canvas()
    {Mon_serpent.Advance();
       
        
        if(Mon_serpent.checkCollision())
        {
            /* Game Over */
            gameOver();

        }
        else
        {
            if(Mon_serpent.Serpent_mange(pommer))
            {
                /* leh serpent anh manje pomme nan */
                Mon_serpent.Mange_pomme = true;
                score ++;
                do
                {
                    pommer.SetNouvo_Position();
                }
                while(pommer.SetNouvo_Position(Mon_serpent))
            }
            ctx.clearRect(0, 0, canvaswidth, canvasheight);
            Mon_serpent.desin();
            pommer.desin();
            showscore();
            setTimeout(refrech_canvas,delay);
        };
    }
    function gameOver()
    {
        ctx.save();
        ctx.font = "Bold 50px sans-serif";
        ctx.fillStyle = "#000000ff";
        ctx.textAlllign = "center";
        ctx.fillText("Mur", canvaswidth/3, canvasheight/3);
        ctx.fillText("Touch Espace pr reprendre*", canvaswidth/3,canvasheight/2);
        ctx.restore();
        score = 0;
    };

    function Rekonmanse()
    {
        Mon_serpent = new snake([[6,4], [5,4], [4,4]], "right");
        pommer = new pomme([20, 10]);
        refrech_canvas()
    }

    function showscore()
    {
        ctx.save();        
        ctx.font = "Bold 200px sans-serif";
        ctx.fillStyle = "#f0f0f0";
        ctx.textAlllign = "center";
        ctx.fillText(score.toString(), canvaswidth/2, canvasheight/2);
        ctx.restore();
    }

    function desiner_Block(ctx, position)
    {
        let x = position[0] * blocksize;
        let y = position[1] * blocksize;
        ctx.fillRect(x, y, blocksize, blocksize);
    }

    function snake(body, direction)
    {
        this.body = body;
        this.direction = direction;
        this.Mange_pomme = false;
        this.desin = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(let i = 0; i < this.body.length; i++)
            {
                desiner_Block(ctx, this.body[i]);
            }
            ctx.restore()
            
        };
        this.Advance = function()
        {
            let nextposition = this.body[0].slice();
            switch(this.direction)
            {
                case "right":
                    nextposition[0] += 1;
                    break;
                case "left":
                    nextposition[0] -= 1;
                    break;
                case "down":
                    nextposition[1] += 1;
                    break;
                case "up":
                    nextposition[1] -= 1;
                    break;
                default:
                    throw("Direction invalid");  
            }
            this.body.unshift(nextposition);
            if(!this.Mange_pomme)
            {
                this.body.pop();
            }else{
                this.Mange_pomme = false;
            };
            
        };
        
        this.setDirection = function(newDirection)
        {
            let allowedDirection;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirection = ["up", "down"];
                    break;                                   
                case "down": 
                case "up":
                    allowedDirection = ["left", "right"];
                    break;
                default:
                    throw("Direction invalid");
            }
            console.log(allowedDirection)
            if(allowedDirection.indexOf(newDirection) > -1 )
            {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function()
        {
            let murCollision  = false;
            let SerpCollision = false;
            let TetSerp = this.body[0];
            let ResyeSerp = this.body.slice(1);
            let xSerp = TetSerp[0];
            let YSerp = TetSerp[1];
            let minX = 0;
            let minY = 0;
            let maxX = widthblock - 1;
            let maxY = heightblock - 1;
            let murhorizontale = xSerp < minX || xSerp > maxX;
            let murverticale = YSerp < minY || YSerp > maxY;

            if(murhorizontale || murverticale)
            {
                murCollision = true;
            };

            for(let i = 0; i < ResyeSerp.length; i++)
            {
                if(xSerp === ResyeSerp[i][0] && YSerp === ResyeSerp[i][1])
                {
                    SerpCollision = true;
                };
            };

            return SerpCollision || murCollision;

        };

        this.Serpent_mange = function(pomme_position)
        {
            let TetSer = this.body[0];
            if( TetSer[0]===pomme_position.position[0]  &&  TetSer[1] === pomme_position.position[1])
            {
                return true;
            }else{
                return false;
            }
        }        

    }

    function pomme(position)
    {
        this.position = position;
        this.desin = function()
        {
            ctx.save();
            ctx.save();
            ctx.fillStyle = "#00ff3cff";
            ctx.beginPath();
            let radius = blocksize/2;
            let x = this.position[0] * blocksize + radius;
            let y = this.position[1] * blocksize + radius;
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();

        };
        this.SetNouvo_Position = function()
        {
            let nouvoX = Math.round(Math.random() * (widthblock-1));
            let nouvoY = Math.round(Math.random() * (heightblock-1));
            this.position = [nouvoX, nouvoY];
        };

        this.Serpent_Pomme = function(Serpe_check)
        {
            let Sou_Serpent = false;
            for(let i = 0; i < Serpe_check.body.length; i++)
            {
                if(this.position[0]===Serpe_check[i][0] && this.position[1]===Serpe_check[i][1])
                {
                    Sou_Serpent = true;
                };
            }
            return Sou_Serpent;
        }
    }



/* jere leh moun nan apiye sou yon touch */
    document.addEventListener('keydown', (event) => {
        console.log(event.key + "heyy");
        let newDirection;
        if(event.key === "ArrowUp"){
            newDirection = "up";
        }
        if(event.key === "ArrowLeft"){
            newDirection = "left";
        }
        if(event.key === "ArrowDown"){
            newDirection = "down"; 
        }
        if(event.key === "ArrowRight"){
            newDirection = "right";
        }
        if(event.code === "Space"){
            if(Mon_serpent.checkCollision())
                {
                    Rekonmanse();
                };
        }
        Mon_serpent.setDirection(newDirection)
    });
    
       

}
