import React, { Fragment, Component } from "react"
import { MuiThemeProvider,
        Button,
        Grid,
        Typography } from '@material-ui/core';
import TopNav from './common/TopNav'
import SearchForm from './containers/SearchForm'
import { getPictures } from './requests/getPhotos'
import { theme } from './styles/theme'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import SearchResults from './containers/SearchResults';
import { Route } from 'react-router-dom'
import * as actionCreators from './actions/actionIndex';
// import { SET_QUERY, SET_PHOTOS, ADD_MORE_PHOTOS, REMOVE_PHOTO } from './actions/actionTypes';



class App extends Component {
  state = {
    page: 0,
  }

  fetchPhotos = (nextPage, q, type) => {
    return getPictures(nextPage, q).then(
    pics => {
        if(pics == "Fetch Error"){
          console.log("Action didn't dispatch")
        }else if(type === 'set'){
          this.props.setPhotos(pics)
        }else if(type === 'add'){
          this.props.addPhotos(pics)
        }
      }
    );
  }

  handleSubmit = (event, q) => {
    event.preventDefault();
    const { oldQuery } = this.props;

    const incrementPage = () => {
      let next = this.state.page + 1;
      this.setState({page: next});
      return next;
    }

    if( q === oldQuery){
      let next = incrementPage();
      this.fetchPhotos(next, q, 'add');
    } else {
      this.setState({page: 0});
      this.props.setQuery(q);
      let next = incrementPage();
      this.fetchPhotos(next, q, 'set');
    }   
  }

  handleAddMorePhotos = (event, q) => {
    event.preventDefault();

    const incrementPage = () => {
      let next = this.state.page + 1;
      this.setState({page: next});
      return next;
    }
    let next = incrementPage();
    this.fetchPhotos(next, q, 'add');
  }

  handleClear = (e) => {
    e.preventDefault();
    this.props.setQuery('');
    this.props.setPhotos([]);
    this.setState({page: 0});
  }; 

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container direction="column" alignItems="center" >
            <Grid item xs={12} >
              <TopNav />
              {/* <Route exact path="/search" component={Search} /> */}
            </Grid>
            <Grid item xs={12}  style={{marginTop: '50px'}}>
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <SearchForm handleSubmit={this.handleSubmit.bind(this)}/>
                  <Button onClick={this.handleClear}>Clear </Button>
                </Grid>
              </Grid>
            </Grid>
            {this.props.pics.length > 0 ?
            <Grid item >
               <SearchResults pixs={this.props.pics}/> 
            </Grid>
            : null}
            {this.props.pics.length > 0 ?
              <Grid item >
                <Typography variant="h4" gutterBottom={false} style={{color: theme.palette.primary.main}}>            
                  Would you like to view more photos from this search?
                </Typography>
                <Button color="secondary" href="#" size="large" variant="contained" onClick={e => this.handleAddMorePhotos(e, this.props.query)} style={{textAlign: 'center'}}>Show More</Button>
              </Grid>
            : null}
        </Grid>

      </ MuiThemeProvider>      
    );
  }
  
}

const mapStateToProps = (state) => {
  return {
    pics: state.setPhotos.pics,
    query: state.setQuery.query
  }
};

 const mapDispatchToProps = (dispatch) => {
  // let test = bindActionCreators(actionCreators, dispatch);
  // debugger;
  return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
