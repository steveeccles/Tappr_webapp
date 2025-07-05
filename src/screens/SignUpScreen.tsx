import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signUp } from '../services/auth';
interface SignUpProps { navigation: any; }

const SignUpScreen: React.FC<SignUpProps> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!displayName || !email || !password || !confirm) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    
    try {
      setLoading(true);
      const cred = await signUp(email, password);
      if (displayName) {
        await cred.user.updateProfile({ displayName });
      }
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        placeholder="Full Name"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
        editable={!loading}
      />
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
      <TextInput
        placeholder="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        style={styles.input}
        secureTextEntry
        editable={!loading}
      />
      <Button 
        title={loading ? "Creating Account..." : "Sign Up"} 
        onPress={handleSignUp}
        disabled={loading}
      />
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')} disabled={loading}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
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

export default SignUpScreen; 