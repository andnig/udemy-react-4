import React, { Component } from "react";
import "./App.css";
import Radium, { StyleRoot } from "radium";
import Person from "./Person/Person";
import uuidv4 from "uuid/v4";

// class-based component (stateful component). Don't use if not necessary
class App extends Component {
  state = {
    persons: [
      { id: uuidv4(), name: "Andi", age: 23 },
      { id: uuidv4(), name: "Peter", age: 25 },
      { id: uuidv4(), name: "John", age: 27 },
      { id: uuidv4(), name: "Moni", age: 21 }
    ],
    otherState: 'some other value',
    showPersons: false
  };

  nameChangedHandler = (event, id) => {
    const personIndex = this.state.persons.findIndex(p => {
      return p.id === id;
    });

    // with {...xxx} create a new object and spread all the properties of the old object
    const person = {...this.state.persons[personIndex]};
    person.name = event.target.value;

    const persons = [...this.state.persons];
    persons[personIndex] = person;

    this.setState( {persons: persons} );
  };

  deletePersonHandler = personIndex => {
    let { persons } = this.state;

    //Note: Always update the state in an immutable fashion. So no state mangling outside setState. Create copy of the state props
    //create a copy of persons
    persons = persons.slice();
    persons.splice(personIndex, 1);
    this.setState({ persons: persons });
  };

  // Basically this is the same as creating a normal method (togglePersonHandler(){}).
  // But the old syntax seen above has problems with the this keywoard. The new syntax creates
  // What we are doing is creating an arrow function which calls a method. this always returns to the App class
  togglePersonsHandler = () => {
    const doesShow = this.state.showPersons;

    // Inside the method call: This is a deconstructing thingy. Acutally you are asked to set the state, however here you set the property showPersons of the state
    // because of the curly braces
    this.setState({ showPersons: !doesShow });
  };

  // use .bind() to pass parameters to a handler
  // alternative: "use () => functionCall(param)" (but bind is more optimized)
  render() {
    // inline css styling
    const style = {
      backgroundColor: "green",
      color: "white",
      font: "inherit",
      border: "1x solid blue",
      padding: "8px",
      cursor: "pointer",
      // the following is valid because of Radium
      ':hover':{
        backgroundColor: 'lightgreen',
        color: 'black'
      }
    };

    const { persons } = this.state;

    let personJsx = null;

    if (this.state.showPersons) {
      personJsx = (
        <div>
          {// map creates single entries from an array and executes a function for each element.
          persons.map((person, index) => {
            return (
              <Person
                name={person.name}
                age={person.age}
                // use the arrow function here to have no problem with this keyword.
                // Alternative: this.deletePersonHandler().bind(this, index)
                click={() => this.deletePersonHandler(index)}
                // Add a key to tell react, which components to rerender if the list is mutated. If no key is given, the whole list is rerendered.
                // Key needs to be unique
                key={person.id}
                changed={(event) => this.nameChangedHandler(event, person.id)}
              />
            );
          })}
        </div>
      );
      style.backgroundColor = "red";
      style[':hover'] = {
        backgroundColor: 'lightgreen',
        color: 'black',
      };
    }

    const classes = [];

    if (this.state.persons.length <= 2)
    {
      classes.push('red');
    }
    if (this.state.persons.length <= 1) {
      classes.push("bold");
    }

    return (
      // StyleRoot is a Radium Component, required to parse Radium media queries
      <StyleRoot>
        <div className="App">
          <p className={classes.join(" ")}>This is a test paragraph.</p>
          <p className="App-intro">
            Hello. To get started, edit
            <code>src/App.js</code>
            and save to reload.
          </p>

          <button
            type="submit"
            onClick={this.togglePersonsHandler}
            style={style}
          >
            Hide/Unhide cards
          </button>
          {personJsx}
        </div>
      </StyleRoot>
    );
  }
}

// Radium is a higher order component
export default Radium(App);
