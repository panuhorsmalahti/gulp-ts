var Greeter = (greeting: string) => {
    this.greeting = greeting;
}

Greeter.prototype.greet = function() {
    return "Hello, " + this.greeting;
}

var greeter = new Greeter("world");
