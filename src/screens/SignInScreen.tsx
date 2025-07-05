import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signIn, sendPasswordReset } from '../services/auth';
interface SignInProps { navigation: any; }

const SignInScreen: React.FC<SignInProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      Alert.alert('Enter email to reset password');
      return;
    }
    try {
      setLoading(true);
      await sendPasswordReset(email);
      Alert.alert('Success', 'Password reset email sent');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Tappr</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        editable={!loading}
      />
      <Button 
        title={loading ? "Signing In..." : "Sign In"} 
        onPress={handleSignIn}
        disabled={loading}
      />
      <TouchableOpacity onPress={handleForgot} disabled={loading}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#333'
  },
  input: { 
    height: 50, 
    borderColor: '#ddd', 
    borderWidth: 1, 
    marginBottom: 12, 
    borderRadius: 8, 
    paddingHorizontal: 12,
    backgroundColor: 'white',
    fontSize: 16
  },
  link: { 
    color: '#0066cc', 
    marginTop: 16, 
    textAlign: 'center',
    fontSize: 16
  },
});

export default SignInScreen; 