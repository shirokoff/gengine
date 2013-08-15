#!/usr/bin/perl

use strict;
use File::Basename;

sub get_includes
{
    my $file_path = shift;
    my $f;
    open $f, $file_path or die "Can't open file $file_path";

    my $content;
    {
        local $/;
        $content = <$f>;
    }

    $content =~ s/(include\("([^"]+?)"\);?)/get_includes(dirname($file_path) . '\/' . $2)/gem;
    close $f;

    $content;
}

print get_includes($ARGV[0]);

