import React from 'react';
import { ListView,Dimensions,StyleSheet, Text, View,TextInput,FlatList,Image,TouchableOpacity,ScrollView } from 'react-native';
import {Constants,Updates } from 'expo';
import { createStackNavigator,createAppContainer } from 'react-navigation';

const apiKey = '23f22278'
const apiUrlSearchMovies = `http://www.omdbapi.com/?apikey=${apiKey}&s=`
const apiUrlSearchMovieInfo = `http://www.omdbapi.com/?apikey=${apiKey}&i=`


const Row = (props) => {
    if(props.Title!='No results'){
        return <TouchableOpacity onPress={props.onSelectRow.bind(this,props.imdbID)}>
        <View style={styles.row}>
            <Image
            style={styles.image}
              source={{uri: `${props.Poster}` }} />
            <View>
            <Text style={{fontSize: 15,fontWeight: 'bold',padding:10,paddingBottom:0}}>
                {props.Title}
            </Text>
            <Text style={{paddingLeft:10,}}>{props.Year} ({props.Type})</Text>
            </View>
        </View>
        </TouchableOpacity>
    }
    else {
        return <View><Text>No results</Text></View>
    }
}

function handleStyle(props) {
    if(props.Source == "Internet Movie Database"){
        width = parseInt(props.Value)/10
    }
    else if(props.Source == "Rotten Tomatoes"){
        width = parseInt(props.Value)/100
    }
    else if(props.Source == "Metacritic"){
        width = parseInt(props.Value)/100
    }
    if(width<0.5){
        color = 'red'
    }
    else if(width<0.7){
        color = 'yellow'
    }
    else{
        color = 'green'
    }
    return {width: width,color: color}
}

const Rating = (props) => {
    style = handleStyle(props)
    return <View style={{padding:10}}>
    <Text>{props.Source} ({props.Value}):</Text>
    <View style={{height: 10,width: props.width*style.width,backgroundColor: style.color}}/>
    </View>
}


class HomeScreen extends React.Component {
    state = {
        text: '',
        result: []
    }
    static navigationOptions ={
        headerTitle: 'Movie Browser',
        headerTintColor: 'teal',
    }
    //processResult = (result, key) => ({id: `${key}`, ...result})
    handle = (text) => {
        this.setState({text})
        fetch(`${apiUrlSearchMovies}${text}`)
        .then(response => response.json())
        .then(result => {
            result.Error ? this.setState({
                result: [{Title: 'No results'}]}) :
                this.setState({result: result.Search})//result.Search.map(this.processResult)})
        })
    }

    onSelectRow = (imdbID) => {
        fetch(`${apiUrlSearchMovieInfo}${imdbID}`)
        .then(response => response.json())
        .then(result => this.props.navigation.navigate('Details',{
            result: result
        }))
    }
    render() {
        console.log(this.state.result)
        console.log(this.state.text.length)
        return (
          <View style={styles.container}>
            <Text style={styles.text}>Home</Text>
            <TextInput style={styles.input}
            onChangeText={this.handle}
            autoFocus placeholder='Search Movies...'/>
            <FlatList
            renderItem={(obj) => (<Row {...obj.item} onSelectRow={this.onSelectRow}/>)}
            data={this.state.result}
            keyExtractor={(item, index) => index.toString()}/>
          </View>
        );}
}

class InfoScreen extends React.Component{
    static navigationOptions = ({navigation}) => ({
        headerTitle: navigation.getParam('result').Title,
        headerTintColor: '#b22222',
    })

    render(){
        var {height, width} = Dimensions.get('window')
        result = this.props.navigation.getParam('result')
        return <ScrollView>
        <Image source={{uri: result.Poster }}
        style={{width: (width/1.05), height: (width/1.05),margin:(width-(width/1.05))/2}} />
        <View style={{flexDirection: 'row',width: width}}>
        <Text style={{
            padding: 5,
            //paddingBottom:10,
            paddingLeft: 10,
            fontSize: 25,
            fontWeight: 'bold'
        }}>{result.Title}</Text>
        <Text style={{padding: 15}}>({result.Year})</Text>
        </View>
        <Text style={{paddingRight:10,paddingLeft:10}}>{result.Rated}, {result.Runtime} {'\n'}{'\n'}
        {result.Plot}</Text>
        <FlatList
        data={result.Ratings}
        renderItem={({item}) => (<Rating {...item} width={width/1.05}/>)}
        keyExtractor={(item, index) => index.toString()}
        />
        </ScrollView>
    }
}




const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    Details: InfoScreen
},{initialRouteName: 'Home'})

export default class App extends React.Component {
    componentDidMount() {Updates.reload()}
  render() {
    return <AppContainer />;
  }
}

const AppContainer = createAppContainer(AppNavigator)







const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
//    alignItems: 'center',
//    justifyContent: 'center',
  },
  text: {
      padding: 20,//Constants.statusBarHeight,
      paddingBottom:10,
      paddingLeft: 10,
      fontSize: 20,
      fontWeight: 'bold'
  },
  input: {
      borderColor: 'black',
      borderWidth: 2,
      margin: 2,
      paddingLeft: 10,
  },
  image: {
      width: 50,
      height: 50,
      margin: 10,
  },
  row: {
      flexDirection: 'row',
  }
});
