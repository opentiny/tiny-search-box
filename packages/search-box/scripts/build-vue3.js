const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('Building Vue 3 compatible version...');

try {
  // 设置环境变量为 Vue 3
  process.env.VUE_VERSION = '3';
  
  // 使用 vite 构建 Vue 3 版本
  console.log('Running Vite build for Vue 3...');
  execSync('vite build --config vite.config.ts', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // 复制构建结果到 vue3 目录
  const distDir = path.join(__dirname, '../dist');
  const vue3DistDir = path.join(__dirname, '../dist/vue3');
  
  if (!fs.existsSync(vue3DistDir)) {
    fs.mkdirSync(vue3DistDir, { recursive: true });
  }
  
  // 复制文件到 vue3 目录
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      
      if (fs.statSync(srcPath).isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  // 复制构建结果
  copyDir(path.join(distDir, 'es'), path.join(vue3DistDir, 'es'));
  copyDir(path.join(distDir, 'lib'), path.join(vue3DistDir, 'lib'));
  copyDir(path.join(distDir, 'types'), path.join(vue3DistDir, 'types'));
  
  console.log('Vue 3 build completed successfully!');
  
} catch (error) {
  console.error('Vue 3 build failed:', error.message);
  process.exit(1);
}