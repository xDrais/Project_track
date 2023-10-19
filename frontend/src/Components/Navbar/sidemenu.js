import { slide as Menu } from 'react-burger-menu'
import React, { Component } from 'react';
import "./navbar.css"
class Example extends React.Component {
  showSettings (event) {
    event.preventDefault();
  }

  render () {
    // hedha el burger menu eli yrod el design responsive taa el navbar 
    return (<div className='hey'>
      <Menu >
        <a id="home" className="menu-item" href="/">HOME</a>
        <a id="about" className="menu-item" href="/about">ABOUT</a>
        <a id="contact" className="menu-item" href="/contact">CONTACT</a>
        <a onClick={ this.showSettings } className="menu-item" href="">SETTINGS</a>
        
      </Menu></div>
    );
  }
}
export default Example;