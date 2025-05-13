// src/components/common/SearchBox.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, transitions } from '../../styles/theme';

const SearchBox = ({ onSearch, placeholder = "Buscar...", initialValue = "" }) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const { colors } = useTheme();

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch && searchTerm.trim() !== "") {
            onSearch(searchTerm);
        }
    };

    const styles = {
        searchForm: {
            display: 'flex',
            position: 'relative',
            width: '100%',
            maxWidth: '350px'
        },
        searchInput: {
            width: '100%',
            padding: `${spacing.sm} ${spacing.md} ${spacing.sm} ${spacing.xxl}`,
            border: `1px solid ${isFocused ? colors.primary : colors.gray200}`,
            borderRadius: '24px',
            backgroundColor: isFocused ? colors.white : 'rgba(11, 68, 68, 0.05)',
            fontSize: typography.fontSize.sm,
            transition: transitions.default,
            boxShadow: isFocused ? `0 0 0 2px ${colors.primary}30` : 'inset 0 2px 5px rgba(11, 68, 68, 0.05)',
            '&:focus': {
                outline: 'none'
            }
        },
        searchIcon: {
            position: 'absolute',
            left: spacing.md,
            top: '50%',
            transform: 'translateY(-50%)',
            color: colors.textSecondary,
            fontSize: '18px'
        },
        searchButton: {
            position: 'absolute',
            right: spacing.xs,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: transitions.default,
            '&:hover': {
                backgroundColor: colors.primaryDark
            }
        }
    };

    return (
        <form onSubmit={handleSearch} style={styles.searchForm}>
            <span style={styles.searchIcon}>🔍</span>
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{
                    ...styles.searchInput,
                    boxShadow: isFocused ? `0 0 0 2px ${colors.primary}30` : 'inset 0 2px 5px rgba(11, 68, 68, 0.05)'
                }}
            />
            <button
                type="submit"
                style={{
                    ...styles.searchButton,
                    backgroundColor: isFocused ? colors.primaryDark : colors.primary
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primaryDark }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isFocused ? colors.primaryDark : colors.primary }}
            >
                ➤
            </button>
        </form>
    );
};

export default SearchBox;