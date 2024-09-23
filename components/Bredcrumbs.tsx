"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const Breadcrumbs = () => {
  const path = usePathname();

  const segements = path.split("/");

  console.log(segements);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {segements.map((segement, index) => {
          if (!segement) return null;

          const href = `/${segements.slice(0, index + 1).join("/")}`;

          const isLast = index === segement.length - 1;

          return (
            <Fragment key={segement}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segement}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{segement}</BreadcrumbLink>
                )}
                
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
