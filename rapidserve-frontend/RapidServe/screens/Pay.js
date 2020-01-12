import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Picker, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, AsyncStorage, Alert } from 'react-native';
import logo from "../images/logo.png";
import { Dropdown } from "react-native-material-dropdown";

export default class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            credit: "",
            amount_to_pay: "",
            new_credit: "",
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
        const {navigation} = this.props;
        AsyncStorage.getItem("myId").then( (userId) => {
            this.request('http://34.83.193.124/users/api/v1.0/' + userId, 'GET')
            .then( (user) => {
                console.log(user);
                this.setState({credit: user.credit, amount_to_pay: navigation.getParam('price', 3.00), new_credit: user.credit - navigation.getParam('price', 3.00) });
            })
        });
    }

    makePayment = async() => {
        AsyncStorage.getItem("myId").then( (userId) => {
            const body = {
                credit: this.state.new_credit,
            }
            this.request('http://34.83.193.124/users/api/v1.0/credit/' + userId, 'PUT', JSON.stringify(body));
            this.props.navigation.goBack();
        });
    }
    

    render() {

        return(
            <KeyboardAvoidingView style={{ flex: 1}} behavior = "padding" enabled keyboardVerticalOffset={75}>
                    <View style = {styles.container}>
                        <Text style = {styles.header}>My Credit: ${this.state.credit.toString()}</Text>
                        <View style = {{height: 10}}></View>
                        <Text style = {styles.message}>Amount Due: ${this.state.amount_to_pay.toString()}</Text>
                        <View style = {{height: 10}}></View>
                        <Text style = {styles.message}>Resulting Credit: ${this.state.new_credit.toString()}</Text>
                        <View style = {{height: 10}}></View>
                        <View style = {{alignItems: "center"}}>
                            <TouchableOpacity onPress = {() => this.makePayment()}>
                                <View style = {{width: "70%", margin: 50, borderRadius: 5, paddingHorizontal: 30, paddingVertical: 10, backgroundColor: "#13C0EB", justifyContent: "center", alignItems: "center" }}>
                                    <Text style = {{color: "#FFFFFF", fontWeight: "bold", fontSize: 14}}>Confirm</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

            </KeyboardAvoidingView>
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
