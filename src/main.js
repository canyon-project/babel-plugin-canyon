class Person {
    constructor(name){
        this.name = name
    }
    say(){
        console.log(this.name)
    }
}

const person = new Person("张三");
person.say()
