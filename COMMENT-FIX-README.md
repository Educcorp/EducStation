# EducStation Comment System Fix

## Issue Description

The comment system in EducStation was failing with 404 errors because the frontend was using incorrect API endpoints:

- Using `/api/comentarios/post/:id` instead of `/api/comentarios/publicacion/:id` for getting comments
- Using `/api/comentarios` instead of `/api/comentarios/publicacion/:id` for creating comments

## Fix Applied

The file `src/services/comentarioService.js` has been updated with the correct endpoints:

1. Changed GET endpoint from:
   ```javascript
   const endpoint = `${API_URL}/comentarios/post/${publicacionId}`;
   ```
   to:
   ```javascript
   const endpoint = `${API_URL}/comentarios/publicacion/${publicacionId}`;
   ```

2. Changed POST endpoint from:
   ```javascript
   const endpoint = `${API_URL}/comentarios`;
   // ...
   const payload = {
     postId: idToUse,
     contenido,
     usuarioId,
     nickname
   };
   ```
   to:
   ```javascript
   const endpoint = `${API_URL}/comentarios/publicacion/${idToUse}`;
   // ...
   const payload = {
     contenido,
     usuarioId,
     nickname
   };
   ```

## Temporary Workaround

If you can't rebuild the application, you can use the browser console fix:

1. Open your browser's developer console (F12)
2. Copy the entire contents of `browser-fix.js` file
3. Paste it into the console and press Enter
4. Refresh the page if needed

## Testing the Fix

To verify the fix works:

1. Navigate to a blog post detail page
2. Check the browser console for logs with "FIXED" in them
3. Try adding a comment and verify it appears in the list

## Notes

- A backup of the original service file is saved as `src/services/comentarioService.js.bak`
- The fix has been built into the production bundle
- If you experience issues, try clearing your browser cache or using incognito mode 