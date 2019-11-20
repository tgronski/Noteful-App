import React from  'react';
import config from '../config'
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types';
import './AddNote.css'


export default class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      // note: {
      // name: "",
      // content: "",
      // folderId:"",
      formValid: false, 
      noteValid: false, 
      contentValid: false, 
      folderSelectValid: false,
      // validationMessage: ''
      // }
    };

  }

  static contextType = ApiContext


validateEntry=(e)=> {
    const value = e.target.value.trim();
    let name=e.target.name
    if (value.length < 1) {
        this.setState({[`${name}Valid`]: false})
  
    } 
    else {
      this.setState({[`${name}Valid`]: true})
      
    }
 
  this.formValid()
  
}

formValid() {
    if ((this.state.noteValid=== false) || (this.state.contentValid===false) ){
        this.setState({
            formValid: false,
        });
    }
    else {this.setState({
        formValid: true,
    })}
   
  }
 
  
  handleSubmit(e) {
    e.preventDefault();
    const note = {
        name: e.target['note'].value,
        content: e.target['content'].value,
        folderId: e.target['folderSelect'].value,
        modified: new Date()
    }
    this.setState({error: null})
    const url =`${config.API_ENDPOINT}/notes`
    const options = {
      method: 'POST',
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
      }
    };
    console.log(this.state.formValid)
    if(this.state.formValid===true){
    fetch(url, options)
      .then(res => {
        if(!res.ok) {
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
      
      .then(note => {
        this.context.handleAddNote(note);

        this.props.history.push(`/folder/${note.folderId}`)
        console.log('saved')
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
      });
    } 
    else (this.setState({
      validationMessage: `${" "}Please ensure you have entered a folder name, note content, and selected a folder from the drop down.`
    }))
  
  }

  

   

  handleCancelAdd = () => {
    this.props.history.push(`/`)
  }

  render() {
    const folders = this.context.folders
    const message = this.state.validationMessage
    const options = folders.map((folder) => {
      return(
        <option
          key= {folder.id}
          value = {folder.id}>
          {folder.name}
        </option>
      )
    })
    const error = this.state.error
          ? <div className="error">{this.state.error}</div>
          : "";

    return (
      <div className="addnote">
        <h2>Add Note</h2>
        { error }
        <form className="addnote__form" onSubmit={e => this.handleSubmit(e)}>
          <label htmlFor="noteName" >Note Name:{" "}</label>
          <input
            type="text"
            name="note"
            id="note"
            placeholder="Note Name"
            value={this.state.name}
            onChange={e => this.validateEntry(e)}/>
          <br/>
          <label htmlFor="content"><br />Note: {" "}<br/></label>
            <textarea 
                className="field"
                name="content" 
                id="content"
                placeholder="Note content"
                value={this.state.content}
                onChange={e => this.validateEntry(e)}/>
          <br/>
          <label htmlFor="folder-select"><br/>Folder:{" "}<br/></label>
            <select
            type='text'
            className='field'
            name='folderSelect'
            id='folderSelect'
            ref={this.folderSelect}
            onChange={e => this.validateEntry(e)}>
                <option value={ null }>Select Folder</option>
                { options }
            </select>
          <div className="addnote__buttons">
            <br/>
            <button type='button' onClick={e => this.handleCancelAdd()}>Cancel</button>
            <span>{' '}</span>
            <button type="submit" disabled={!this.state.formValid}>Save</button>
          {message}
          </div>  
        </form>
      </div>
    );
  }
}

AddNote.propTypes ={
  name: PropTypes.string,
  content: PropTypes.string,
  folderId: PropTypes.string,
  formValid: PropTypes.bool,
  titleValid: PropTypes.bool,
  contentValid: PropTypes.bool,
  folderSelectValid:PropTypes.bool,
  validationMessage: PropTypes.string
}