import React, { Component } from 'react';
import $ from 'jquery';
import classnames from 'classnames';

class Repositories extends Component {

  constructor(props){
    
    super(props);

    this.state = {
      loading: false,
      username: props.username,
      displayName: '',
      repos: [],
      currentPage: 1,
      subRepos: [],
      totalPages: undefined
    }

    this.mostActive = ['Ocramius', 'brianchandotcom', 'taylorotwell', 'GrahamCampbell', 'michalbe'];

  }

  componentDidMount() {

    const { username } = this.props;

    if (username){
      this.setState({
        loading: true
      })
      this.fetchRepos(username);
    }

  }

  componentWillUnmount() {
    if (this.request) this.request.abort();
  }
  

  render(){

    const { username, subRepos, loading, displayName } = this.state;

    const pagination = this.renderPagination();

    return (
      <div>

        <form className="username" onSubmit={this.handleUserSubmit.bind(this)}>

          <input type="text" value={username} onChange={this.handleUserChange.bind(this)} />

          <button disabled={username.trim() === ''}>Get repos</button>
          <br/>

          <small>Most active: {this.mostActive.map(u => (
            <a key={u} className="active-user" href="" onClick={this.setUser.bind(this, u)}>{u}</a>
          ))}</small>

        </form>

        {loading && <div>loading...</div>}
        
        <div className="repositories">

          {displayName && <div>Repositories for '{displayName}'</div>}

          <ul>
            {subRepos.map(r => 
              <li target="_blank" key={r.id}><a href={r.html_url}>{r.name}</a></li>
            )}
          </ul>

        </div>

        <div className="pagination">
          {pagination}
        </div>

      </div>
    );

  }

  renderPagination(){

    const { currentPage, totalPages } = this.state;

    if (!totalPages || totalPages === 1) return null;

    let pages = [];

    for(let i = 1; i <= totalPages; i++){
      pages.push(
        <button 
          key={i} 
          className={ classnames({active: i === currentPage}) }
          onClick={this.setCurrentPage.bind(this, i)} 
        >
         {i}
        </button>
      );
    }

    return pages;

  }

  handleUserChange(e){

    const { value: username } = e.target;

    this.setState({
      username
    })

  }

  handleUserSubmit(e){

    e.preventDefault();

    const { username } = this.state;
    let user = username.trim();

    if (user === '') return;
    
    if (this.request) this.request.abort();

    this.fetchRepos(user);
  }

  setUser(username, e){

    e.preventDefault();

    this.setState({
      username
    })

  }

  setCurrentPage(currentPage){

    const { repos } = this.state;
    const { perPage } = this.props;

    const start = (currentPage - 1) * perPage;

    this.setState({
      currentPage,
      subRepos: repos.slice(start, start + perPage)
    })

  }

  fetchRepos(user){    
    
    this.request = $.get(`https://api.github.com/users/${user}/repos`);

    this.setState({
      loading: true
    })

    this.request
      .then(repos => {

        const displayName = user;

        this.setState({
          repos,
          displayName,
          username: '',
          loading: false
        }, () => {
          this.resetPagination();
        })

        this.request = null;

      })
      .fail(res => {

        this.setState({
          loading: false
        })

        console.log(res.statusText)

      })
  }

  resetPagination(){

    const { repos } = this.state;
    const { perPage } = this.props;

    const totalPages = Math.ceil(repos.length / perPage);
    const subRepos = repos.slice(0, perPage);

    this.setState({
      currentPage: 1,
      totalPages,
      subRepos
    })
  }

}

Repositories.defaultProps = {
  username: ''
}

export default Repositories;