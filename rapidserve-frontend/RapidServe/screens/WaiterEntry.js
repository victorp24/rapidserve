import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, AsyncStorage, Alert } from 'react-native';
import { Dropdown } from "react-native-material-dropdown";

class ItemCell extends Component {
    render () {
        return (
            <View style = {[styles.sportTab, {backgroundColor: "#13C0EB" }]} >
              <View style = {styles.label}>
                <Text style = {styles.position}>{this.props.value}</Text>
              </View>
            </View>
        );
    }
}

export default class WaiterEntry extends Component {
    static navigationOptions = {
        title: 'Process an order as this table`s waiter.',
        headerTintColor: "#292E30",
        headerStyle: {
            backgroundColor: "#292E30",
        },
        headerTitleStyle: {
            color: "#FFFFFF",
        },
        headerBackTitleStyle: {
            fontWeight: "bold"
        },
        headerBackImageStyle: {
            tintColor: "#292E30",
        }
    };
    
    constructor(props) {
        super(props);
        this.state = {
            table_id: "",
            item: "",
            items: [],
        }
    }
    addItem = () => {
        let price;
        let name;
        if(this.state.item === "Burger - $4.00") {
            price = 4.0;
            name = "Burger";
        } else if(this.state.item === "Salad - $3.00") {
            price = 3.0;
            name = "Salad";
        } else if(this.state.item === "Fries - $2.50") {
            price = 2.5;
            name = "Fries";
        } else if(this.state.item === "Soda - $1.50") {
            price = 1.5;
            name = "Soda";
        } else if(this.state.item === "Ice Cream - $3.00") {
            price = 3.0;
            name = "Ice Cream";
        } else if(this.state.item === "Lasagna - $8.00") {
            price = 8.0;
            name = "Lasagna"
        } else if(this.state.item === "Beer - $7.00") {
            price = 3.0;
            name = "Beer";
        }
        
        var orderItem = [name, price, 0];
        var orderList = this.state.items;
        orderList.push(orderItem);
        this.setState({
            items: orderList,
        })
        console.log(this.state.items);
    }

    removeItem = () => {
        let price;
        let name;
        if(this.state.item === "Burger - $4.00") {
            price = 4.0;
            name = "Burger";
        } else if(this.state.item === "Salad - $3.00") {
            price = 3.0;
            name = "Salad";
        } else if(this.state.item === "Fries - $2.50") {
            price = 2.5;
            name = "Fries";
        } else if(this.state.item === "Soda - $1.50") {
            price = 1.5;
            name = "Soda";
        } else if(this.state.item === "Ice Cream - $3.00") {
            price = 3.0;
            name = "Ice Cream";
        } else if(this.state.item === "Lasagna - $8.00") {
            price = 8.0;
            name = "Lasagna"
        } else if(this.state.item === "Beer - $7.00") {
            price = 7.0;
            name = "Beer";
        }
        
        var orderItem = [name, price, 0];
        var orderList = this.state.items;
        orderList.push(orderItem);
        this.setState({
            items: orderList,
        })
        console.log(this.state.items);
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

    postTable = async () => {
        const { navigation } = this.props;

        var price = 0;
        var arrayLength = this.state.items.length;
        for(var i = 0; i < arrayLength; i++) {
            price = price + this.state.items[i][1];
        }
        const waiter_id = await AsyncStorage.getItem("myId");
        const jsonBody =  {
            table_id: navigation.getParam("tableId", "100"),
            waiter_id: waiter_id,
            order: this.state.items,
            amount: price,
            amount_left: price,
        };

        this.request('http://34.83.193.124/users/api/v1.0/new_order', 'POST', JSON.stringify(jsonBody)
        ).then( () => {
            Alert.alert("Success!", "Order created.");
            this.props.navigation.goBack();
        })

    }
    
    render() {
        let menu = [{
            value: "Burger - $4.00",
        }, {
            value: "Salad - $3.00",
        }, {
            value: "Fries - $2.50",
        }, {
            value: "Soda - $1.50",
        }, {
            value: "Ice Cream - $3.00",
        }, {
            value: "Lasagna - $8.00",
        }, {
            value: "Beer - $7.00",
        }];


        return(
            <ScrollView style = {styles.container}>
                <View style = {styles.container}>
                    <View style = {styles.itemCard}>
                        <Text style = {styles.addMenuItem}>ADD MENU ITEM</Text>
                        <Dropdown
                            data = {menu}
                            label = "Choose a menu item"
                            baseColor = "white"
                            textColor = "white"
                            itemColor = "black"
                            selectedItemColor = "black"
                            disabledItemColor = "black"
                            onChangeText = { (item) => this.setState({item: item}) }
                        />
                        <View style = {{flexDirection: "row", justifyContent: "center", flex: 1}}>
                            <View style = {{flex: 1, margin: 10}}>
                                <Button
                                    color = "#13C0EB"
                                    title = "Add"
                                    onPress = { () => { this.addItem(); } }
                                />
                            </View>
                            {/* <View style = {{flex: 1, margin: 10}}>
                                <Button
                                    color = "#13C0EB"
                                    title = "Remove"
                                    onPress = { () => { this.removeItem(); } }
                                />
                            </View> */}
                        </View>
                        <View>
                                {this.state.items.map((item) => {
                                    return(
                                        <ItemCell value = {item[0] + " - $" + item[1]} />
                                    );
                                })}
                            </View>
                    </View>
                </View>
                <View style = {{alignItems: "center"}}>
                    <TouchableOpacity onPress = {() => this.postTable()}>
                        <View style = {{width: "70%", borderRadius: 5, paddingHorizontal: 30, paddingVertical: 10, backgroundColor: "#13C0EB", justifyContent: "center", alignItems: "center" }}>
                            <Text style = {{color: "#FFFFFF", fontWeight: "bold", fontSize: 14}}>PROCESS ORDER</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#292E30',
    },
    itemCard: {
        margin: 10,
        borderColor: "#13C0EB",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    addMenuItem: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        color: "#FFFFFF",
    },
    sportTab: {
        flexDirection: "row",
        marginVertical: 2,
        marginHorizontal: 10,
        flex: 1,
        borderWidth: 0,
        borderColor: "rgba(0,0,0,0.4)",
        borderRadius: 10
    },
      sportIcon: {
        height: 60,
        width: 60,
        margin: 5
    },
      position: {
        fontSize: 36,
        color: "#FFFFFF",
    },
      level: {
        fontSize: 12,
        fontStyle: "italic"
    },
      logo: {
        flex: 1,
        flexDirection: "row"
    },
      label: {
        flex: 8,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});