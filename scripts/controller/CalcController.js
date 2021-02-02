class CalcController { 
    constructor(){ 
        this._lastOperator = "";
        this._lastNumber = "";
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._operation = [];
        this._locale = 'pt-br';
        this._displayCalEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
    }
    pastFromClipboard()
    {
        document.addEventListener('paste',e => {
            let text = e.clipboardData.getData('text');
            this.displayCalc = parseFloat( text );
        });
    }
    copyToClipboard()
    {
        let input = document.createElement('input');
        input.value = this.displayCalc.innerHTML;
        
        document.body.appendChild(input);
        input.select();

        document.execCommand('Copy');
        input.remove();
    }
    initialize()
    {
        this.setDisplayTime();
        setInterval(() => {
            this.setDisplayTime();   
        }, 1000); 
        this.setLastNumberToDisplay();
        this.pastFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(  btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            })
        })
    }
    addEventListenerAll(element , events, fn){
        // console.log('click');
        events.split(' ').forEach( e => {
            element.addEventListener(e, fn, false);
        });
    }
    toggleAudio()
    {
        this._audioOnOff = !this._audioOnOff;
    }
    playAudio()
    {
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        };
    }
    clearAll()
    {
        this._operation = []; 
        this._lastNumber = ''; 
        this._lastOperator = ''; 
        this.setLastNumberToDisplay();

    }
    initKeyBoard()
    {
        this.playAudio();

        document.addEventListener('keyup', e => {
            switch (e.key) {
                case 'Escape':
                    this.clearAll();      
                break;
                case 'Backspace':
                    this.clearEntry();
                break;
                case '*': 
                case '%': 
                case '-': 
                case '/': 
                case '+':
                    this.addOperation( e.key );
                    
                    break;
                case '=':
                case 'Enter':
                    this.calc();
                    break;
                    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9': 
                    this.addOperation( parseInt(e.key));
                break;
                case '.':
                case ',':
                    this.addDot(); 
                    break; 
                case 'c':
                    if( e.ctrlKey ) this.copyToClipboard(); 
                    break; 
            }
        });
    }
    clearEntry()
    {
        this._operation.pop();
        this.setLastNumberToDisplay();

    } 
    getLastOperation()
    {
        return this._operation[this._operation.length -1];
    }
    isOperator(valor)
    {
        return ( ['+','-','*','/','%'].indexOf(valor) > -1 );
    }
    setLastOperation(valor)
    {
        this._operation[this._operation.length -1] = valor; 
    }
    pushOparator(valor){
        this._operation.push(valor);  
        console.log(this._operation, 'F');
        if(this._operation.length > 3 ){
            this.calc();
        }
    }
    getResult(){
        try {
            return eval(this._operation.join(""));
        } catch (error) {
            setTimeout(() => {
                this.setError();    
            }, 1);
        }
    }
    getLastItem( isOperator = true )
    {
        let lastItem;

        for( let i = ( this._operation.length -1 ); i >= 0; i--){
  
            if( this.isOperator( this._operation[i] ) == isOperator ){
                lastItem = this._operation[i];
                break;
            } 

        }
        if(!lastItem){
            lastItem = (isOperator)? this._lastOperator : this._lastNumber ;
        }

        return lastItem;
    }
    calc(){
        
        let last = '';
        this._lastOperator = this.getLastItem();
        if( this._operation.length < 3 ){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

            this._lastNumber = this.getResult();
        }
        if( this._operation.length > 3 ){
            last = this._operation.pop();

            this._lastNumber = this.getResult();
        } else if( this._operation.length == 3 ){ 

            this._lastNumber = this.getLastItem(false);
        }
        // console.log('numer ',this._lastNumber );
        // console.log( 'operator ',this._lastOperator);

        let result = this.getResult();

        if( last == '%' ){

            result /= 100;
            this._operation = [ result ];

        }else{
            this._operation = [ result ];
            if(last) this._operation.push(last);
        }
        this.setLastNumberToDisplay();

    }

    setLastNumberToDisplay()
    {
        let lastNumber = this.getLastItem(false);

        if( !lastNumber ) lastNumber = 0;

        this.displayCalc = lastNumber;
    }
    addOperation(valor)
    { 
        if ( isNaN( this.getLastOperation() ) ){ 

            if(this.isOperator(valor)){ 
                 
                this.setLastOperation(valor);

            }else{
                this.pushOparator(valor);  
                
                this.setLastNumberToDisplay();

            } 
        }else{ 

            if(this.isOperator(valor)){

                this.pushOparator(valor);  

            }else{

                let newValue = this.getLastOperation().toString()+valor.toString(); 
                this.setLastOperation( newValue );

                this.setLastNumberToDisplay();
            } 
        } 

    }
    addDot()
    {
        let lastOperation = this.getLastOperation();
        // no inicio
        // apos um numero
        // depois de um operador
        // no fim
        if( typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        if( !this.isOperator(lastOperation) && lastOperation.toString().split('').indexOf('.') > -1) return;
        // console.log(lastOperation);
        if( this.isOperator(lastOperation) || !lastOperation ){
            this.pushOparator('0.');
        }else{
            this.setLastOperation( lastOperation.toString() + '.' );
        }
        this.setLastNumberToDisplay();
        // if( isNaN(valor)){ 
        //     console.log('outra coisa', valor);
        // }
    
    } 
    setError()
    {
        this.displayCalc = 'ERROR';
    } 
    execBtn( value )
    {
        this.playAudio();
        // console.log(value, 'exec');
        switch (value) {
            case 'ac':
                this.clearAll();      
            break;
            case 'ce':
                this.clearEntry();
            break;
            case 'multiplicacao':
                this.addOperation( '*'); 
                break;
            case 'porcento':
                this.addOperation( '%'); 
                break;
            case 'subtracao':
                this.addOperation( '-'); 
                break;
            case 'divisao':
                this.addOperation( '/'); 
                break;
            case 'soma':
                this.addOperation( '+');
                
                break;
            case 'igual':
                this.calc();
                break;
                
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9': 
                this.addOperation( parseInt(value));
            break;
            case 'ponto':
                this.addDot(); 
                break;
            default:
                this.setError();
            break;
        }
    }
    initButtonsEvents()
    {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach(( button, index ) => {
            this.addEventListenerAll( button, 'click drag', e => {
                let textBtn = button.className.baseVal.replace('btn-',''); 
                // console.log(textBtn);
                this.execBtn( textBtn );
            })
            this.addEventListenerAll( button, 'mouseover mouseup mousedown', e => {
                button.style.cursor = 'pointer';
            })
        });
    }
    setDisplayTime()
    {
        this.dataAtual = this.dataAtual.toLocaleDateString(this._locale);
        this.displayTime = this.dataAtual.toLocaleTimeString(this._locale);        
    }
    get displayCalc() 
    { 
        return this._displayCalEl;
    } 
    set displayCalc( valor ) 
    {
        if(valor.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalEl.innerHTML = valor; 
    }
    get dataAtual() 
    { 
        return new Date();
    } 
    set dataAtual( valor ) 
    {
        this._dateEl.innerHTML = valor; 
    } 
    get displayTime() 
    { 
        return this._timeEl;
    } 
    set displayTime( valor ) 
    {
        this._timeEl.innerHTML = valor; 
    } 
}