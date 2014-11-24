/*** @jsx React.DOM */

var Form = React.createClass({
  getInitialState: function () {
    return {data: [], query: '', filter: 'title'};
  },
  handleSubmit: function (e) {
    e.preventDefault();
    this.state.data.push({
      query: this.state.query,
      filter: this.state.filter
    });
    this.setState({query: ''});
  },
  onChangeQuery: function (e) {
    this.setState({query: e.target.value});
  },
  render: function () {
    return (
      <div>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.query} onChange={this.onChangeQuery} />
          <button>Search</button>
        </form>
        <QueryResults data={this.state.data} />
      </div>
    );
  }
});

var QueryResult = React.createClass({
  getInitialState: function () {
    return {
      title: '',
      desc: '',
      year: '',
      rating: '',
      poster: ''
    };
  },
  componentDidMount: function () {
    var self = this,
      query = this.props.query.query,
      filter = this.props.query.filter;

    $.ajax({
      url: "http://imdb.wemakesites.net/api/1.0/get/" + filter + "/",
      data: {
        q: query
      },
      dataType: "jsonp",
      crossDomain: true,
      success: function (response) {
        if (self.isMounted()) {
          self.saveMovieData(response);
        }
      }
    });
  },
  saveMovieData: function (data) {
    this.setState({
      title: data.data.title,
      desc: decodeURIComponent((data.data.description+'').replace(/\+/g, '%20')),
      year: data.data.year,
      rating: data.data.rating,
      poster: data.data.poster
    });
  },
  render: function () {
    return (
      <div>
        <h2>Searching phrase:
          <strong>&nbsp;{this.props.query.query}</strong>
        </h2>
        <hr />
        <div class="asdasd">
          <img src={this.state.poster} alt="poster" />
        </div>
        <div>
          <h3>{this.state.title} ({this.state.year}) / <span>{this.state.rating}</span></h3>
          <p>{this.state.desc}</p>
          <hr />
        </div>
      </div>
    )
  }
});

var QueryResults = React.createClass({
  render: function () {
    var queries = this.props.data.map(function (query) {
      return <QueryResult query={query} />
    });

    return (
      <div>{queries}</div>
    )
  }
});

React.render(<Form />, document.getElementById('content'));
