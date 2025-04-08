import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
} from 'react-native';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
      /****** Q4: Start Coding here. State the correct IP/port******/
      const response = await fetch('http://10.0.2.2:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
      /****** Q4: Code Ends here******/
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}



class IssueFilter extends React.Component {
  render() {
    return (
      <>
      {/****** Q1: Start Coding here. ******/}
      <View style={styles.container}>
        <Text style={styles.text}>[IssueFilter Placeholder test]</Text>
      </View>
      {/****** Q1: Code ends here ******/}
      </>
    );
  }
}



const width= [40,80,80,80,80,80,200];
const columnWidths = [40, 80, 80, 60, 100, 100, 400];


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { flexDirection: 'row', height: 40, backgroundColor: '#537791' },
  row: { flexDirection: 'row', height: 40, backgroundColor: '#E7E6E1' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, borderRadius: 5 },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#537791',
    borderRightWidth: 1,
    borderRightColor: '#fff',
  }
});





function IssueRow(props) {
  const issue = props.issue;
  {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
  const cells = [
    issue.id,
    issue.status,
    issue.owner,
    issue.effort,
    new Date(issue.created).toLocaleDateString(),
    issue.due ? new Date(issue.due).toLocaleDateString() : 'N/A',
    issue.title,
  ];
  {/****** Q2: Coding Ends here.******/}
  return (
    <>
    {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
    <View style={styles.row}>
      {cells.map((value, i) => (
        <Text key={i} style={[styles.cell, { width: columnWidths[i] }]}>
          {value}
        </Text>
      ))}
    </View>
    {/****** Q2: Coding Ends here. ******/}  
    </>
  );
}
  


  

function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );

  {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
  const headers = ['ID', 'Status', 'Owner', 'Effort', 'Created', 'Due', 'Title'];

  const header = (
    <View style={styles.header}>
      {headers.map((title, i) => (
        <Text key={i} style={[styles.headerCell, { width: columnWidths[i] }]}>
          {title}
        </Text>
      ))}
    </View>
  );

  {/****** Q2: Coding Ends here. ******/}
  
  
  return (
    <ScrollView horizontal>
      <View style={styles.container}>
      {/****** Q2: Start Coding here to render the table header/rows.**********/}
        {header}
        {issueRows}
      {/****** Q2: Coding Ends here. ******/}
      </View>
    </ScrollView>
  );
}



  
class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs******/
    this.state = {
      title: '',
      owner: '',
      effort: '',
    };
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  handleTitleChange = (text) => this.setState({ title: text });
  handleOwnerChange = (text) => this.setState({ owner: text });
  handleEffortChange = (text) => this.setState({ effort: text });
  /****** Q3: Code Ends here. ******/
  
  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    const { title, owner, effort } = this.state;

    const newIssue = {
      title: title.trim(),
      owner: owner.trim(),
      effort: parseInt(effort, 10),
      status: 'New',
    };

    this.props.createIssue(newIssue);

    this.setState({ title: '', owner: '', effort: '' });
    /****** Q3: Code Ends here. ******/
  }
  
  render() {
    return (
        <View>
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <TextInput
          style={styles.input}
          placeholder="Title"
          value={this.state.title}
          onChangeText={this.handleTitleChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Owner"
            value={this.state.owner}
            onChangeText={this.handleOwnerChange}
          />
          <TextInput
            style={styles.input}
            placeholder="Effort"
            keyboardType="numeric"
            value={this.state.effort}
            onChangeText={this.handleEffortChange}
          />
          <Button title="Add Issue" onPress={this.handleSubmit} />
        {/****** Q3: Code Ends here. ******/}
        </View>
    );
  }
}




class BlackList extends React.Component {
  constructor() { 
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log("constructor called test")
    /****** Q4: Start Coding here. Create State to hold inputs******/
    this.state = { name: '',};
    this. handleNameChange = this.handleNameChange.bind(this);
    /****** Q4: Code Ends here. ******/
  }
  /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  handleNameChange(text) {
    this.setState({ name: text });
  }
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
  /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
    const { name } = this.state;
    const query = `mutation addToBlacklist($nameInput: String!) {
      addToBlacklist(nameInput: $nameInput)
    }`;
    const data = await graphQLFetch(query, { nameInput: name.trim() });

    if (data && data.addToBlacklist) {
      alert(`"${name}" has been blacklisted.`);
      this.setState({ name: '' });
    }
  /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View style={{ marginVertical: 16 }}>
      {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Blacklist a name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name to blacklist"
          value={this.state.name}
          onChangeText={this.handleNameChange}
        />
        <Button title="Blacklist Name" onPress={this.handleSubmit} />
      {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}




export default class IssueList extends React.Component {
  constructor() {
      super();
      this.state = { issues: [] };
      this.createIssue = this.createIssue.bind(this);
  }
  
  componentDidMount() {
  this.loadData();
  }

  async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
  }
  
  
  render() {
    return (
      <ScrollView contentContainerStyle={{ padding: 16}}>
      {/****** Q1: Start Coding here. ******/}
        <IssueFilter />
      {/****** Q1: Code ends here ******/}


      {/****** Q2: Start Coding here. ******/}
        <IssueTable issues={this.state.issues} />
      {/****** Q2: Code ends here ******/}

      
      {/****** Q3: Start Coding here. ******/}
        <IssueAdd createIssue={this.createIssue} />
      {/****** Q3: Code Ends here. ******/}

      {/****** Q4: Start Coding here. ******/}
        <BlackList />
      {/****** Q4: Code Ends here. ******/}
      </ScrollView>     
    );
  }
}
