import * as React from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, ScrollView, FlatList } from 'react-native';

const styles = StyleSheet.create({
    TableInfoView: {
        height: "85%",
        backgroundColor: "#ffffff"
    },
    TableInfoFooter: {
        flexDirection: "row",
        height: "15%"
    },
    PayView: {
        backgroundColor: "#13C0EB",
        height: "100%",
        alignContent: "center",
        justifyContent: "center"
    },
    PayTouchable:{
        width: "100%",
        height: "100%",
    },
    PayText:{
        color: "#ffffff",
        fontSize: 25,
        textAlign: "center",
    },
    RequestView: {
        backgroundColor: "#292E30",
        height: "100%",
        alignContent: "center",
        justifyContent: "center"
    },
    RequestTouchable:{
        width: "50%",
        height: "100%",
    },
    RequestText:{
        color: "#ffffff",
        fontSize: 25,
        textAlign: "center",
    }
});

class CustomerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            order: null,
            selected: [],
        };
    }

    static navigationOptions = {
        title: "Table Information",
        headerTintColor: "#ffffff",
        headerStyle: {
          backgroundColor: "#13C0EB",
          color: "#ffffff"
        },
        headerBackTitleStyle: {
            color: "#ffffff",
            fontWeight: "bold"
        },
        headerBackImageStyle: {
            color: "#ffffff",
            backgroundColor: "#ffffff",
        }
    };

    componentDidMount() {
        this.focusSubscription = this.props.navigation.addListener("willFocus", (() => {
            this._getData();
        }));
    }

    componentWillUnmount() {
        this.focusSubscription.remove();
    }

    request = async (url,method,body) => {
        return new Promise((resolve,reject) => {
          if (method === 'GET') {
            fetch(url)
            .then(response => {
              if(response.headers.get("content-length") == 0) {
                return 0;
              }
              var responseJson = response.json();
              return responseJson;
            })
            .then(data => {
              resolve(data)
            })
            .catch(err => {
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

    _getData = async () => {
        try {
            const { navigation } = this.props;
            this.request('http://34.83.193.124/users/api/v1.0/get_order/' + navigation.getParam("tableId", "155"), 'GET').then(
                (info) => {
                    this.setState({dataSource: info})
                    this.setState({order: info["order"]})
                    console.log('order:', this.state.order)
                }
            )
        } catch(error) {
            Alert.alert("Get Data Error",error.message);
        }
    }

    renderItem = (data) => {
        console.log('data.item', data.item);
        console.log('data.item[#]', data.item[0]);
        return(
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate("Pay", {
                        item: data.item[0],
                        price: data.item[1],
                        paid: data.item[2]
                    });
                }}
            >
                <View style = {{alignItems: "center", justifyContent: "center", height: 60, width: "100%", flexDirection: "row", backgroundColor: "#ffffff"}}>
                    {data.item[2] === 0 &&(<Text style={{marginLeft: 10, fontSize: 30, color: "#13C0EB"}}>{data.item[0]}</Text>)}
                    {data.item[2] === 0 &&(<Text style={{marginLeft: 10, fontSize: 30, color: "#13C0EB"}}> - ${data.item[1]}</Text>)}
                    {data.item[2] === 1 &&(<Text style={{marginLeft: 10, fontSize: 30, color: "#d3d3d3"}}>{data.item[0]}</Text>)}
                    {data.item[2] === 1 &&(<Text style={{marginLeft: 10, fontSize: 30, color: "#d3d3d3"}}> - ${data.item[1]}</Text>)}
                </View>
            </TouchableOpacity>
        );
    }

    FlatListItemSeparator = () => {
        return (
          <View style={{
             height: 0.5,
             width:"80%",
             backgroundColor:"#13C0EB",
             alignSelf: "center",
             marginTop: "0.25%",
             marginBottom: "0.25%"
          }}
        />
        );
    }

    render() {
        return (
            <View>
                <ScrollView style={styles.TableInfoView}>
                    <FlatList
                        data = {this.state.order}
                        ItemSeparatorComponent = {this.FlatListItemSeparator}
                        renderItem= {(item) => this.renderItem(item)}
                    />
                </ScrollView>
                <View style={styles.TableInfoFooter}>
                    <TouchableOpacity style={styles.PayTouchable}>
                        <View style={styles.PayView}>
                            <Text style={styles.PayText}>
                                Pay
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default CustomerView;