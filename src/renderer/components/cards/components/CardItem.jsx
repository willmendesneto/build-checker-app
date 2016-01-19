// 'use strict';
//
// import React from 'react';
// import CardStore from '../stores/CardStore';
//
//
// const CardItem = React.createClass({
//   getInitialState() {
//     return {
//       item: {}
//     };
//   }
//
//   componentDidMount() {
//     this.loadData();
//   }
//
//   loadData() {
//     CardStore.findById(this.props.cardId).then( function(item) {
//         this.setState({
//           item: item
//         });
//     }.bind(this));
//   }
//
//   render() {
//     return (
//       <div className="col-sm-12 card-item">
//           <h2>{this.state.item.name}</h2>
//           <img className="card-item-image clearfix" src={this.state.item.image}
//               alt={this.state.item.name}
//               title={this.state.item.name}
//               width="200"
//               height="200" />
//
//         <div className="info">
//           <div className="desc">{this.state.item.description}</div>
//           <p>Website: <a href={this.state.item.website} target="_blank">{this.state.item.website}</a></p>
//         </div>
//       </div>
//     );
//   }
// });
// export default CardItem;
