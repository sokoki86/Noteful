import { isThisQuarter } from 'date-fns';
import React from 'react';
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationErrors/ValidationError';

import './AddNote.css';

class AddNote extends React.Component
{

    static contextType = ApiContext;

    constructor(props) {
        super(props);

        this.state = {
            name: {
                value: '',
                touched: false,
            },
            content: {
                value: '',
                touched: false,
            },
            folder: {
                value: '',
                touched: false
            },
            fetchError: ''
        }
    }

    onNameChanged(name) {
        this.setState({name: {value: name, touched: true}});
    }

    onContentChanged(content) {
        this.setState({content: {value: content, touched: true}});
    }

    onFolderChanged(folder) {
        this.setState({folder: {value: folder, touched: true}});
    }

    isNameValid() {
        let name = this.state.name.value.trim();
        if(name.length === 0) {
            return 'Name must have a value';
        } else if(name.length < 3) {
            return 'Name must be at least 3 characters';
        }
    }

    isContentValid() {
        let content = this.state.content.value.trim();
        if(content.length === 0) {
            return 'Content must have a value';
        }
    }

    isFolderValid() {
        let folder = this.state.folder.value;
        if(folder === '') {
            return 'Please select a folder'
        }
    }

    onSubmit(e) {
        e.preventDefault();
        let request = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name.value,
                modified: new Date().toISOString(),
                folderId: this.state.folder.value,
                content: this.state.content.value
            })
        };
        fetch('http://localhost:9090/notes', request).then(
            resp => resp.json()
        ).then(data => {
            this.context.addNote(data);
            this.props.history.push('/folder/' + data.folderId);
        }).catch(error => {
            console.error(error);
            this.setState({fetchError: 'An error has occurred: ' + error});
        });
    }

    render() {
        if(this.state.hasError) {
            return (
                <div class="error">
                <h2>An issue has arisen within the AddFolder component.</h2>
                <p>Please contact the administrator.</p>
                </div>
            )
        }
        return (
            <form className="AddNote__form" onSubmit={e => this.onSubmit(e)}>
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
                <div className="form-group">
                    {this.state.content.touched && (
                        <ValidationError message={this.isContentValid()} />
                    )}
                    <label htmlFor="content">Content: </label>
                    <textarea name="content" id="content" onChange={e => this.onContentChanged(e.target.value)} />
                </div>
                <div className="form-group">
                    {this.state.folder.touched && (
                        <ValidationError message={this.isFolderValid()} />
                    )}
                    <label htmlFor="folder">Folder: </label>
                    <select name="folder" onChange={e => this.onFolderChanged(e.target.value)}>
                        <option value="">-- Please select an option --</option>
                        {this.context.folders.map(folder => {
                            return <option value={folder.id} key={folder.id}>{folder.name}</option>
                        })}
                    </select>
                </div>
                <hr />
                <div className="form__buttons">
                    <button type="submit" disabled={
                        this.isNameValid() ||
                        this.isContentValid() ||
                        this.isFolderValid()
                    }>
                        Submit
                    </button>
                </div>
            </form>
        );
    }

}

export default AddNote;