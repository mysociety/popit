use strict;
use warnings;

local $/ = undef;
my $all = <>;

$all =~ s{,\n\ +"from":.*?(,|\n)}{$1}xmsg;

print $all;
