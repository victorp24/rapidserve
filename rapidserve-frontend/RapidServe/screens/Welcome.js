import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Picker, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, AsyncStorage, Alert } from 'react-native';
import logo from "../images/logo.png";
import { Dropdown } from "react-native-material-dropdown";

export default class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone_number: "",
            role: "",
            restaurant_id: "",
        }
    }

    updateProfile = async() => {
        const userId = await AsyncStorage.getItem("myId");
        const { navigation } = this.props;
        const body = {
            phone_number: this.state.phone_number,
            role: this.state.role,
            restaurant_id: this.state.restaurant_id,
        }
        fetch("http://34.83.193.124/users/api/v1.0/waiter/" + userId, {
            method: "PUT",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(body)
        }).then(() => {
            AsyncStorage.setItem("myRole", this.state.role.toString()).then( () => {
                Alert.alert("Success!", "Profile Updated");
                this.props.navigation.navigate('App');
            })
        }).catch(err => {
            console.log(err);
        })
    }

    render() {

        let roles = [{
            value: "As a Customer",
        }, {
            value: "As a Waiter",
        }];

        return(
            <KeyboardAvoidingView style={{ flex: 1}} behavior = "padding" enabled keyboardVerticalOffset={75}>
                    <View style = {styles.container}>
                        <Text style = {styles.header}>Welcome to RapidServe!</Text>
                        <Text style = {styles.message}>We are pleased to have you join our service. As a welcome gift, here's $100! Treat it as store credit for select establishments near you.</Text>
                        <Text style = {styles.message}>To complete your profile, please fill in the form below:</Text>
                        <Dropdown
                            data = {roles}
                            label = "How will you be using RapidServe?"
                            baseColor = "white"
                            textColor = "white"
                            itemColor = "black"
                            selectedItemColor = "black"
                            disabledItemColor = "black"
                            onChangeText = { (userRole) => {
                                if(userRole === "As a Customer") {
                                    this.setState({role: 0});
                                } else {
                                    this.setState({role: 1});
                                }
                            }}
                        />
                        <View style = {{height: 10}}></View>
                        <Text style = {{color: "#FFFFFF"}}>Restaurant ID (for waiters)</Text>
                        <TextInput
                            style = {styles.textinput}
                            placeholder = "Only waiters must fill this in"
                            maxLength = {12}
                            onChangeText = {(id) => this.setState({restaurant_id: id})}
                            value = {this.state.restaurant_id}
                        />
                        <View style = {{height: 10}}></View>
                        <Text style = {{color: "#FFFFFF"}}>Mobile Number</Text>
                        <TextInput
                            style = {styles.textinput}
                            placeholder = "Enter your number"
                            maxLength = {12}
                            onChangeText = {(num) => this.setState({phone_number: num})}
                            value = {this.state.phone_number}
                        />
                        <View style = {{alignItems: "center"}}>
                            <TouchableOpacity onPress = {() => this.updateProfile()}>
                                <View style = {{width: "70%", borderRadius: 5, paddingHorizontal: 30, paddingVertical: 10, backgroundColor: "#13C0EB", justifyContent: "center", alignItems: "center" }}>
                                    <Text style = {{color: "#FFFFFF", fontWeight: "bold", fontSize: 14}}>Submit</Text>
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
