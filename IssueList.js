
import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import DateTimePicker from '@react-native-community/datetimepicker';



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



const width= [40,80,80,80,100,100,200];


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { flexDirection: 'row', height: 40, backgroundColor: '#537791' },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',   // Ensures cell grows vertically
    minHeight: 40,              // Instead of fixed height
    backgroundColor: '#E7E6E1',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },  
  cell: {
    flex: 1,
    flexShrink: 1, // ⬅️ allows text to wrap if it overflows
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  
  headerCell: {
    flex: 1,
    flexShrink: 1, // ⬅️ same for header
    paddingVertical: 10,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#537791',
    borderRightWidth: 1,
    borderRightColor: '#fff',
    flexWrap: 'wrap',
    maxWidth: 200,
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
        <Text key={i} numberOfLines={0} style={[styles.cell, { width: width[i], flexWrap: 'wrap'}]}>
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
        <Text key={i} numberOfLines={0} style={[styles.headerCell, { width: width[i] }]}>
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
      due: new Date(),
      showDatePicker: false,
    };
    
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  handleTitleChange = (text) => this.setState({ title: text });
  handleOwnerChange = (text) => this.setState({ owner: text });
  handleEffortChange = (text) => this.setState({ effort: text });
  handleDueDateChange = (event, selectedDate) => {
    this.setState({ 
      due: selectedDate || this.state.due, 
      showDatePicker: false 
    });
  };
  
  /****** Q3: Code Ends here. ******/
  
  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    const { title, owner, effort, due} = this.state;

    if (!title.trim() || !owner.trim() || isNaN(effort)) {
      alert('Please fill in all fields correctly.');
      return;
    }

    const newIssue = {
      title: title.trim(),
      owner: owner.trim(),
      effort: parseInt(effort, 10),
      due: due,
      status: 'New',
    };

    this.props.createIssue(newIssue);
    this.setState({ title: '', owner: '', effort: '' });
    /****** Q3: Code Ends here. ******/
  }
  
  render() {
    return (
      <View style={{ marginTop: 20, padding: 10 }}>
      {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter issue title"
          value={this.state.title}
          onChangeText={this.handleTitleChange}
        />

        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Owner</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter owner name"
          value={this.state.owner}
          onChangeText={this.handleOwnerChange}
        />

        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Effort (hours)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter effort estimate"
          keyboardType="numeric"
          value={this.state.effort}
          onChangeText={this.handleEffortChange}
        />

        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Due Date</Text>
        <Button
          title={this.state.due.toDateString()}
          onPress={() => this.setState({ showDatePicker: true })}
        />

        {this.state.showDatePicker && (
          <DateTimePicker
            value={this.state.due}
            mode="date"
            display="default"
            onChange={this.handleDueDateChange}
          />
        )}


       


        <View style={{ marginTop: 10 }}>
          <Button title="Add Issue" onPress={this.handleSubmit} />
        </View>
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
      <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
      {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
          Blacklist a name:
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter name to blacklist"
          value={this.state.name}
          onChangeText={this.handleNameChange}
        />

        <View style={{ marginTop: 10 }}>
          <Button title="Blacklist Name" onPress={this.handleSubmit} />
        </View>
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
