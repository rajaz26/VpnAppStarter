import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import RNSimpleOpenvpn, {
  addVpnStateListener,
  removeVpnStateListener,
} from 'react-native-simple-openvpn'

const Home = () => {
  const [vpnState, setVpnState] = useState('Not Connected')
  console.log('RNSimpleOpenvpn module:', RNSimpleOpenvpn)

  useEffect(() => {
    // Add VPN state listener
    const initVpnState = () => {
      addVpnStateListener((event) => {
        console.log('VPN State:', event)
        if (event.level === 'LEVEL_CONNECTED') {
          setVpnState('Connected')
        } else if (event.level === 'LEVEL_NOTCONNECTED') {
          setVpnState('Not Connected')
        }
      })
    }

    initVpnState()

    // Clean up the listener
    return () => {
      removeVpnStateListener()
    }
  }, [])

  const startVpn = async () => {
    const vpnConfig = {
      remoteAddress: '192.168.1.1 3000', // Replace with your server IP and port
      ovpnFileName: 'US_1', // Replace with the actual OVPN file name (without .ovpn extension)
      assetsPath: '', // Path where your .ovpn file is located
      providerBundleIdentifier: 'com.example.app.vpn',
      localizedDescription: 'Test VPN Connection',
    }

    console.log('VPN Configuration:', vpnConfig)

    try {
      // Verify if RNSimpleOpenvpn is defined
      if (!RNSimpleOpenvpn || typeof RNSimpleOpenvpn.connect !== 'function') {
        console.error('RNSimpleOpenvpn module is not properly initialized.')
        return
      }

      console.log('Attempting to start VPN...')

      await RNSimpleOpenvpn.connect(vpnConfig)
      console.log(
        'VPN started successfully.',
        await RNSimpleOpenvpn.connect(vpnConfig)
      )
    } catch (error) {
      console.error('Error while starting VPN:', error)
    } finally {
      console.log('VPN connection attempt completed.')
    }
  }

  const stopVpn = async () => {
    try {
      await RNSimpleOpenvpn.disconnect()
      console.log('VPN stopped')
    } catch (error) {
      console.error('Error stopping VPN:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.status}>VPN Status: {vpnState}</Text>
      <Button title="Start VPN" onPress={startVpn} />
      <Button title="Stop VPN" onPress={stopVpn} />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 18,
    marginBottom: 20,
  },
})
