import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Picker, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, AsyncStorage, Alert } from 'react-native';
import logo from "../images/logo.png";
import { Dropdown } from "react-native-material-dropdown";



export default class WaiterView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fully_paid: 0,
            not_fully_paid: 1,
        }
    }

    request = async (url,method,body) => {
        return new Promise((resolve,reject) => {
          if (method === 'GET') {
            console.log('GOT1');
            fetch(url)
            .then(response => {
              console.log('START1');
              if(response.headers.get("content-length") == 0) {
                return 0;
              }
              var responseJson = response.json();
              console.log('END');
              return responseJson;
            })
            .then(data => {
              console.log('GOT2');
              resolve(data)
              console.log('GOOOTEEM');
            })
            .catch(err => {
              console.log('GOT3');
              reject(err)
            });
          } else {
            fetch(url, {
              method: method,
              headers: {
                Accept: 'application/json',
                'content-type': 'application/json',
              },
              body: body
            }).then(response => response.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
          }
        });
      }

    componentDidMount() {
        const { navigation } = this.props;
        this.request('http://34.83.193.124/users/api/v1.0/get_order/' + navigation.getParam("tableId", "155"), 'GET')
        .then( (table) => {
            if(table.amount_left <= 0) {
                this.setState({fully_paid: 1, not_fully_paid: 0});
            }
        })
    }
    
    refresh = () => {
        const { navigation } = this.props;
        this.request('http://34.83.193.124/users/api/v1.0/get_order/' + navigation.getParam("tableId", "155"), 'GET')
        .then( (table) => {
            if(table.amount_left <= 0) {
                this.setState({fully_paid: 1, not_fully_paid: 0});
            }
        })
    }

    render() {


        return(
            <View style = {styles.container}>

            {!this.state.fully_paid && (
            
            <TouchableOpacity
                style={styles.TouchableOpacityScanAgain}
                onPress={() => this.refresh() }               
            >
                <View style = {{borderRadius: 5, padding: 20, backgroundColor: "#13C0EB", justifyContent: "center", alignItems: "center" }}>
                        <Text style = {{fontSize: 16, color: "#FFFFFF"}}> Your table has not fully paid yet. Click this message to refresh and check again. </Text>
                </View>

            </TouchableOpacity>

            )}


            {!this.state.not_fully_paid && (<TouchableOpacity
                style={styles.TouchableOpacityScanAgain}              
            >
                <View style = {{borderRadius: 5, padding: 20, backgroundColor: "#13C0EB", justifyContent: "center", alignItems: "center" }}>
                    <Text style = {{fontSize: 16, color: "#FFFFFF"}}> Your table has fully paid! Click here to send them the receipt via SMS. </Text>
                </View>

            </TouchableOpacity>
            )}



            </View>
        );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 60,
        paddingRight: 60,
        backgroundColor: "#292E30",
    },
    form: {
        alignSelf: "stretch",
    },
    header: {
        color: "#FFFFFF",
        marginTop: 20,
        fontSize: 24,
        paddingBottom: 10,
        borderBottomColor: "#13C0EB",
        borderBottomWidth: 3,
    },

    message: {
        color: "#FFFFFF",
        marginTop: 20,
        fontSize: 16,
        paddingBottom: 10,
    },

    textinput: {
        alignSelf: "stretch",
        height: 40,
        marginTop: 5,
        marginBottom: 20,
        borderColor: "#13C0EB",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        color: "#FFFFFF",
    },
    textinputdescription: {
        alignSelf: "stretch",
        height: 100,
        marginTop: 5,
        marginBottom: 20,
        borderColor: "#ff8c00",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    }
});
