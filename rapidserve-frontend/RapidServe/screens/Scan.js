import * as React from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

const styles = StyleSheet.create({
    TouchableOpacityScan: {
        width: "100%",
        height: "15%",
    },
    TextScan: {
        color: "#ffffff",
        fontSize: 30,
        textAlign: "center",
    },
    ViewScan: {
        width: "100%",
        height: "100%",
        backgroundColor: "#13C0EB",
        alignContent: "center",
        justifyContent: "center"
    },
    Scanner: {
        height: "85%",
        width: "100%",
    },
    TouchableOpacityConfirm: {
        width: "50%",
        height: "100%",
    },
    TextConfirm: {
        color: "#ffffff",
        fontSize: 30,
        textAlign: "center",
    },
    ViewConfirm: {
        width: "100%",
        height: "100%",
        backgroundColor: "#13C0EB",
        alignContent: "center",
        justifyContent: "center"
    },
    TouchableOpacityScanAgain: {
        width: "50%",
        height: "100%",
    },
    TextScanAgain: {
        color: "#ffffff",
        fontSize: 30,
        textAlign: "center",
    },
    ViewScanAgain: {
        width: "100%",
        height: "100%",
        backgroundColor: "#292E30",
        alignContent: "center",
        justifyContent: "center"
    },
    Bottom: {
        flexDirection: "row",
        height: "15%"
    },
    Row: {
        flexDirection: "row"
    },
    Box: {
        width: 300,
        height: 300,
        borderWidth: 10,
        borderColor: "#13C0EB",
        alignSelf: "center",
        marginTop: "35%",
        borderRadius: 30
    }
});

class Scan extends React.Component {
    static navigationOptions = {
        title: "",
        headerTintColor: "#13C0EB",
        headerStyle: {
          backgroundColor: "#13C0EB",
        },
        headerBackTitleStyle: {
            color: "white",
            fontWeight: "bold"
        },
        headerBackImageStyle: {
            tintColor: "white",
        }
      };

    state = {
        hasCameraPermission: null,
        scanned: false,
        tableId: null,
    };

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    handleBarCodeScanned = ({ data }) => {
        this.setState({ scanned: true });
        this.setState({tableId: data});
        alert(`Table ID: ${data} has been scanned!`);
    };

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

    putTableId = async () => {
        const table = {
            table_id: this.state.tableId
        };
        AsyncStorage.getItem("myId").then((response) => {
            fetch("http://34.83.193.124/users/api/v1.0/" + response, {
                method: "PUT",
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(table)
            }).then(() => {
                AsyncStorage.getItem("myRole").then((role) => {
                    console.log("GOT HERE1");
                    console.log(role);
                    if(role === "0") {
                        console.log("GOT HERE2");
                        this.props.navigation.navigate("CustomerView", {
                            tableId: this.state.tableId
                        });
                    } else {
                        console.log("GOT HERE3");
                        this.request('http://34.83.193.124/users/api/v1.0/table_exists/' + this.state.tableId, 'GET')
                        .then( (table) => {
                            if(table) {
                                console.log("YOOOOOOOO")
                                this.props.navigation.navigate("WaiterView", {
                                    tableId: this.state.tableId
                                })

                            } else {
                                this.props.navigation.navigate("WaiterEntry", {
                                    tableId: this.state.tableId
                                });
                            }
                        }) 

                    }
                });
            }).catch(err => {
                console.log(err);
            })
        })
    }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting permission of camera</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Camera permission not granted</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>

        <View
            style={styles.TouchableOpacityScan}
            onPress={() => this.setState({ scanned: false })}
        >
            <View
                style={styles.ViewScan}
            >
                    <Text
                        style={styles.TextScan}
                    >
                        Scan A QR Code
                    </Text>
            </View>

        </View>

        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={styles.Scanner}>

            <View style={styles.Box}>

            </View>
              
        </BarCodeScanner>   

        {!scanned &&(<View
            style={styles.TouchableOpacityScan}
            onPress={() => this.setState({ scanned: false })}
        >
            <View
                style={styles.ViewScan}
            >
                    <Text
                        style={styles.TextScan}
                    >
                        Scan A QR Code
                    </Text>
            </View>

        </View>)}

        {scanned &&(<View style={styles.Bottom}>

            {scanned && (<TouchableOpacity
                style={styles.TouchableOpacityScanAgain}
                onPress={() => 
                    this.setState({ scanned: false, tableId: null })
                }
            >
                <View
                    style={styles.ViewScanAgain}
                >
                        <Text
                            style={styles.TextScanAgain}
                        >
                            Scan Again
                        </Text>
                </View>

            </TouchableOpacity>
            )}

            {scanned && (<TouchableOpacity
                style={styles.TouchableOpacityConfirm}
                onPress={() => this.putTableId()}
            >
                <View
                    style={styles.ViewConfirm}
                >
                        <Text
                            style={styles.TextConfirm}
                        >
                            Confirm
                        </Text>
                </View>

            </TouchableOpacity>
            )}
        </View>)}

      </View>
    );
  }
}

export default Scan;
