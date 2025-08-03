import {
  existsSync,
  mkdirSync,
  renameSync,
  rmdirSync,
  writeFileSync,
  rmSync,
} from "fs";
import { execSync } from "child_process";

const componentName = process.argv[2];
if (!componentName) {
  console.error("Usage: pnpm add:component <component-name>");
  console.error("Example: pnpm add:component button");
  process.exit(1);
}

const toPascalCase = (str) =>
  str.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase());

const kebabCase = componentName;
const PascalCase = toPascalCase(componentName);
const originalPath = `app/components/ui/${kebabCase}.tsx`;
const newDir = `app/components/${PascalCase}`;
const newPath = `${newDir}/${PascalCase}.tsx`;

// Dynamic test template - works for any component
const createDynamicTest = (PascalCase) => {
  return `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ${PascalCase} } from './${PascalCase}';
import '@testing-library/jest-dom';

describe('${PascalCase}', () => {
  it('renders without crashing', () => {
    render(<${PascalCase} />);
    // Basic rendering test - component should mount without errors
  });

  it('accepts and applies custom className', () => {
    render(<${PascalCase} className="test-class" data-testid="${kebabCase}-test" />);
    const element = screen.getByTestId('${kebabCase}-test');
    expect(element).toHaveClass('test-class');
  });

  it('forwards additional props', () => {
    render(<${PascalCase} data-testid="${kebabCase}-test" id="test-id" />);
    const element = screen.getByTestId('${kebabCase}-test');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  // TODO: Add component-specific tests here
});
`;
};

try {
  console.log(`📦 Installing ${componentName} with shadcn...`);
  execSync(`pnpm dlx shadcn@latest add ${componentName} --overwrite`, {
    stdio: "inherit",
  });

  if (!existsSync(originalPath)) {
    console.error(`❌ Component file not found: ${originalPath}`);
    console.error(
      "Make sure the component name is correct and shadcn supports it."
    );
    console.error(
      "Available components: button, card, input, badge, form, select, etc."
    );
    process.exit(1);
  }

  console.log(`📁 Creating folder structure...`);
  mkdirSync(newDir, { recursive: true });
  renameSync(originalPath, newPath);

  // Remove empty ui directory if it's empty
  try {
    rmdirSync("app/components/ui");
    console.log("🗑️  Cleaned up empty ui directory");
  } catch (e) {
    // Directory not empty or doesn't exist, ignore
  }

  // Create index.ts
  const indexContent = `export * from "./${PascalCase}";\n`;
  writeFileSync(`${newDir}/index.ts`, indexContent);

  // Create dynamic test file
  const testContent = createDynamicTest(PascalCase);
  writeFileSync(`${newDir}/${PascalCase}.test.tsx`, testContent);

  console.log(`✅ ${PascalCase} installed successfully!`);
  console.log(`📂 Structure created:`);
  console.log(`   app/shared/components/${PascalCase}/`);
  console.log(`   ├── ${PascalCase}.tsx`);
  console.log(`   ├── ${PascalCase}.test.tsx (with dynamic tests)`);
  console.log(`   └── index.ts`);
  console.log(
    `📝 Import: import { ${PascalCase} } from "@components/${PascalCase}";`
  );
  console.log(`🧪 Tests: Basic rendering + className + props forwarding`);
} catch (error) {
  console.error("❌ Error:", error.message);

  // Clean up if something went wrong
  if (existsSync(newDir)) {
    rmSync(newDir, { recursive: true, force: true });
  }

  process.exit(1);
}
