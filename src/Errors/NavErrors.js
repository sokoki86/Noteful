import React from 'react';

 class NavError extends React.Component {
     constructor(props) {
         super(props);
         this.state = {
             hasError: false,
         }
     }

     static getDerivedStateFromError(error) {
         return { hasError: true };
     }

     render() {
         if(this.state.hasError) {
             return (
                 <h2>An error has occurred in the Nav Menu. Please contact the administrator.</h2>
             )
         }
         return this.props.children;
     }
 }

 export default NavError;