//this is not secure, if you actually want to make it secure, use middelware...

"use client"

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import ElectionDashboard from '@/components/edit/ElectionDashboard';

const Page: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const PAGE_PASSWORD: string | undefined = process.env.NEXT_PUBLIC_PAGE_PASSWORD;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === PAGE_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className='pl-52 pt-20'>
          <Link href="/" passHref legacyBehavior>
            <a
              style={{
                display: 'inline-block',
                marginBottom: '20px',
                padding: '10px 20px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Return
            </a>
          </Link>
        </div>

        <ElectionDashboard />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Enter Password to Access this Page</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    width: '200px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    marginTop: '10px',
    color: 'red',
  },
};

export default Page;
