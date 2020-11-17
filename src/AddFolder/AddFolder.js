import React from 'react';

import ApiContext from '../ApiContext';
import ValidationError from '../ValidationErrors/ValidationError';

import './AddFolder.css'

class AddFolder extends React.Component
{

    static contextType = ApiContext;

    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: '',
                touched: false
            },
            fetchError: ''
        };
    }

    onNameChanged(name) {
        this.setState({name: {value: name, touched: true}});
    }

    isNameValid() {
        const name = this.state.name.value.trim();
        if(name.length === 0) {
            return 'Name must have a value'
        } else if(name.length < 3) {
            return 'Name must be at least 3 characters'
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const name = this.state.name.value;
        console.log(name);
        fetch('http://localhost:9090/folders/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'name': name
            })
        }).then(resp => resp.json())
        .then(data => {
            this.context.addFolder(data);
            this.props.history.push('/');
        }).catch(error => {
            console.error(error);
            this.setState({fetchError: 'An error has occurred: ' + error});
        });
    }

    render() {
        return (
            <form className="AddFolder__form" onSubmit={e => this.onSubmit(e)}>
                {this.state.fetchError !== '' && (
                    <h3>{this.state.fetchError}</h3>
                )}
                <div className="form-group">
                    {this.state.name.touched && (
                        <ValidationError message={this.isNameValid()} />
                    )}
                    <label htmlFor="name">Name: </label>
                    <input name="name" id="name" onChange={e => this.onNameChanged(e.target.value)} />
                </div>
                <hr />
                <div className="form__buttons">
                    <button className="form__button" disabled={this.isNameValid()}>
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}

export default AddFolder;