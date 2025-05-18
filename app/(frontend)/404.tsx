import { ErrorPage } from '@/components/error-page';

export default function Custom404() {
  return (
    <ErrorPage
      title="Page Not Found"
      message="The page you're looking for doesn't exist or you don't have permission to view it."
      code="404"
    />
  );
}
